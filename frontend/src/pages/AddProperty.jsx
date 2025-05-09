import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function AddProperty() {
  const { currentUser, getUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'house',
  });
  
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 10) {
      setError('You can only upload up to 10 images');
      return;
    }
    
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      error: null
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];
    
    const uploadPromises = images.map(async (image, index) => {
      const storageRef = ref(storage, `properties/${currentUser.uid}/${Date.now()}_${image.file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image.file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImages(prev => {
              const newImages = [...prev];
              newImages[index] = {
                ...newImages[index],
                uploading: true,
                progress
              };
              return newImages;
            });
          },
          (error) => {
            setImages(prev => {
              const newImages = [...prev];
              newImages[index] = {
                ...newImages[index],
                uploading: false,
                error: error.message
              };
              return newImages;
            });
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setImages(prev => {
                const newImages = [...prev];
                newImages[index] = {
                  ...newImages[index],
                  uploading: false,
                  url: downloadURL
                };
                return newImages;
              });
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    try {
      setUploading(true);
      setError('');
      
      // Get user profile for contact info
      const userProfile = await getUserProfile();
      
      if (!userProfile) {
        setError('Unable to fetch user profile. Please try again.');
        setUploading(false);
        return;
      }
      
      // Upload images and get URLs
      const imageUrls = await uploadImages();
      
      // Create property document
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        images: imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: userProfile.name || currentUser.displayName,
        userPhone: userProfile.phone || ''
      };
      
      // Add to Firestore
      const docRef = await addDoc(collection(db, "properties"), propertyData);
      
      setSuccess(true);
      
      // Navigate to the property page
      setTimeout(() => {
        navigate(`/property/${docRef.id}`);
      }, 2000);
      
    } catch (error) {
      console.error("Error adding property:", error);
      setError('Failed to add property. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">List Your Property</h1>
          
          {success ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your property has been successfully listed! Redirecting you to the property page...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder="e.g. Modern Family Home with Garden"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="input-field"
                            placeholder="e.g. 350000"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                          <select
                            id="propertyType"
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            required
                            className="input-field"
                          >
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="townhouse">Townhouse</option>
                            <option value="land">Land</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Property Details */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Details</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                          <input
                            type="number"
                            id="bedrooms"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            required
                            min="0"
                            className="input-field"
                            placeholder="e.g. 3"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                          <input
                            type="number"
                            id="bathrooms"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            required
                            min="0"
                            className="input-field"
                            placeholder="e.g. 2"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Area (sqft)</label>
                          <input
                            type="number"
                            id="area"
                            name="area"
                            value={formData.area}
                            onChange={handleChange}
                            required
                            min="0"
                            className="input-field"
                            placeholder="e.g. 2000"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Location */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          required
                          className="input-field"
                          placeholder="e.g. 123 Main St, New York, NY 10001"
                        />
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Description</h2>
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="5"
                          required
                          className="input-field"
                          placeholder="Describe your property..."
                        ></textarea>
                      </div>
                    </div>
                    
                    {/* Image Upload */}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6">
                          <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400" />
                            <p className="mt-1 text-sm text-gray-600">
                              Drag and drop images here, or click to select files
                            </p>
                            <input
                              type="file"
                              id="images"
                              multiple
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById('images').click()}
                              className="mt-2 btn-secondary"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Images
                            </button>
                            <p className="mt-2 text-xs text-gray-500">
                              You can upload up to 10 images. PNG, JPG, JPEG up to 5MB each.
                            </p>
                          </div>
                        </div>
                        
                        {/* Preview Images */}
                        {images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                              <div key={index} className="relative">
                                <div className="group relative aspect-square bg-gray-100 overflow-hidden rounded-md">
                                  <img 
                                    src={image.preview} 
                                    alt={`Preview ${index}`} 
                                    className="w-full h-full object-cover"
                                  />
                                  
                                  {image.uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                                      <div className="w-full max-w-sm px-4">
                                        <div className="relative pt-1">
                                          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                            <div 
                                              style={{ width: `${image.progress}%` }}
                                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                                            ></div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200"
                                  >
                                    <X className="h-4 w-4 text-gray-700" />
                                  </button>
                                </div>
                                
                                {image.error && (
                                  <p className="text-xs text-red-500 mt-1 truncate">Error: {image.error}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Submit Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="w-full md:w-auto btn-primary flex items-center justify-center"
                      >
                        {uploading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          'List Property'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddProperty;