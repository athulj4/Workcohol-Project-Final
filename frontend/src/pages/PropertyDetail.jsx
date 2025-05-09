import React from 'react';
import { useParams } from 'react-router-dom';
import ImageGallery from '../components/ImageGallery';

function PropertyDetail() {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ImageGallery />
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
                <p className="text-gray-600">
                  Loading property details...
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
                    <p className="font-medium">Loading...</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Area</p>
                    <p className="font-medium">Loading...</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="font-medium">Loading...</p>
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