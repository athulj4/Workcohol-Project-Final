import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist from backend on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/wishlist/');
        setWishlist(response.data); // Adjust if your API returns {results: [...]}
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (property) => {
    try {
      await axios.post('/api/wishlist/', { property_id: property.id });
      setWishlist((prev) => [...prev, property]);
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (propertyId) => {
    try {
      await axios.delete(`/api/wishlist/${propertyId}/`);
      setWishlist((prev) => prev.filter(item => item.id !== propertyId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}