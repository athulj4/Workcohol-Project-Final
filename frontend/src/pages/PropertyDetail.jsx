import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';
import api from '../utils/axios';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}/`);
        setProperty(response.data);
      } catch (error) {
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ImageGallery images={property?.images || []} />

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {loading ? 'Loading...' : property?.title || 'Property Details'}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
                <p className="text-gray-600">
                  {loading
                    ? 'Loading property details...'
                    : property?.description || 'No description available.'}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500">Property ID</p>
                    <p className="font-medium">{id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">
                      {loading ? 'Loading...' : property?.price ? `$${property.price}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Area</p>
                    <p className="font-medium">
                      {loading ? 'Loading...' : property?.area || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">
                      {loading ? 'Loading...' : property?.property_type || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bedrooms</p>
                    <p className="font-medium">
                      {loading ? 'Loading...' : property?.bedrooms ?? 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bathrooms</p>
                    <p className="font-medium">
                      {loading ? 'Loading...' : property?.bathrooms ?? 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium">
                      {loading ? 'Loading...' : property?.location || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created At</p>
                    <p className="font-medium">
                      {loading
                        ? 'Loading...'
                        : property?.created_at
                        ? new Date(property.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;