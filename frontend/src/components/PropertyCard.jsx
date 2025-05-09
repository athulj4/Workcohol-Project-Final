  import React from 'react';
  import { Link } from 'react-router-dom';
  import { Heart, BedDouble, Bath, Square, MapPin } from 'lucide-react';
  import { useAuth } from '../contexts/AuthContext';
  import { useWishlist } from '../contexts/WishlistContext';

  function PropertyCard({ property }) {
    const { currentUser } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const wishlistStatus = isInWishlist(property.id);

    const handleWishlist = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!currentUser) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }
      
      if (wishlistStatus) {
        await removeFromWishlist(property.id);
      } else {
        await addToWishlist(property.id);
      }
    };

    return (
      <Link to={`/property/${property.id}`} className="block group">
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="relative">
            {/* Property Image */}
            <div className="h-48 overflow-hidden">
              <img 
                src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            {/* Wishlist button */}
            <button 
              onClick={handleWishlist}
              className={`absolute top-3 right-3 p-2 rounded-full ${wishlistStatus ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'} transition-colors duration-200 shadow-md`}
            >
              <Heart className={`h-4 w-4 ${wishlistStatus ? 'fill-current' : ''}`} />
            </button>
            
            {/* Price badge */}
            <div className="absolute bottom-0 left-0 bg-primary text-white px-4 py-1 rounded-tr-lg font-bold">
              ${property.price.toLocaleString()}
            </div>
          </div>
          
          <div className="p-4">
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{property.title}</h3>
            
            {/* Location */}
            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              <span className="text-sm line-clamp-1">{property.location}</span>
            </div>
            
            {/* Property details */}
            <div className="flex justify-between text-gray-600 mt-4">
              <div className="flex items-center">
                <BedDouble className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.area} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  export default PropertyCard;