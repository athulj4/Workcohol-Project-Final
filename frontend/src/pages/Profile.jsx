import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';

function Profile() {
  const { user, refreshUser } = useAuth(); // Assume refreshUser reloads user data
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '',
    photoFile: null,
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        photoFile: e.target.files[0],
        photoURL: URL.createObjectURL(e.target.files[0]),
      }));
    }
  };

  // Save profile changes
  const handleSave = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('displayName', formData.displayName);
    data.append('email', formData.email);
    if (formData.photoFile) {
      data.append('photo', formData.photoFile);
    }
    try {
      // Use Axios instance for authenticated request
      await api.post('/profile/update/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEditMode(false);
      refreshUser && refreshUser(); // Reload user data if available
    } catch (err) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      photoURL: user?.photoURL || '',
      photoFile: null,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        <div className="flex justify-end mb-4">
          {!editMode ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-600">
                </span>
              )}
            </div>
            <div>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <div className="border-t pt-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account Created</label>
                <p className="mt-1 text-gray-900">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
                <p className="mt-1 text-gray-900">
                  {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;