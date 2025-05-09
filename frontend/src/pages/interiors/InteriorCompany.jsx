import React from 'react';
import { useParams } from 'react-router-dom';

function InteriorCompany() {
  const { company } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Interior Design by {company}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Content will be added when needed */}
        <p className="text-gray-600">Loading interior design services...</p>
      </div>
    </div>
  );
}

export default InteriorCompany;