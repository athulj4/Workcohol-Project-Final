import React, { useEffect, useState } from 'react';
import api from '../utils/axios';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/properties/')
      .then(res => setProperties(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Dream Home</h1>
        
        {/* Results */}
        <div className="mb-8">
          {loading && properties.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map(property => (
                <div key={property.id} className="bg-white rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-bold text-gray-800">{property.title}</h2>
                  <p className="text-gray-600">{property.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                  <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyList;