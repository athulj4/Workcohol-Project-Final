import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import PropertyCard from '../components/PropertyCard';

function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Your wishlist is empty</p>
          <p className="text-gray-500 mt-2">Save properties you're interested in to view them later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;