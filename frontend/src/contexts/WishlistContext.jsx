import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  doc, 
  setDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchWishlist() {
      if (currentUser) {
        try {
          setLoading(true);
          const docRef = doc(db, "wishlists", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists() && docSnap.data().properties) {
            // Fetch all property details for wishlisted properties
            const propertyIds = docSnap.data().properties;
            const properties = [];
            
            for (const id of propertyIds) {
              const propertyDoc = await getDoc(doc(db, "properties", id));
              if (propertyDoc.exists()) {
                properties.push({
                  id: propertyDoc.id,
                  ...propertyDoc.data()
                });
              }
            }
            
            setWishlist(properties);
          } else {
            // Create wishlist document if it doesn't exist
            await setDoc(docRef, { properties: [] });
            setWishlist([]);
          }
        } catch (error) {
          console.error("Error fetching wishlist:", error);
          setWishlist([]);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist([]);
        setLoading(false);
      }
    }

    fetchWishlist();
  }, [currentUser]);

  async function addToWishlist(propertyId) {
    if (!currentUser) return false;
    
    try {
      const docRef = doc(db, "wishlists", currentUser.uid);
      await updateDoc(docRef, {
        properties: arrayUnion(propertyId)
      });
      
      // Fetch the property details and add to state
      const propertyDoc = await getDoc(doc(db, "properties", propertyId));
      if (propertyDoc.exists()) {
        setWishlist(prev => [...prev, {
          id: propertyDoc.id,
          ...propertyDoc.data()
        }]);
      }
      
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  }

  async function removeFromWishlist(propertyId) {
    if (!currentUser) return false;
    
    try {
      const docRef = doc(db, "wishlists", currentUser.uid);
      await updateDoc(docRef, {
        properties: arrayRemove(propertyId)
      });
      
      // Remove from state
      setWishlist(prev => prev.filter(property => property.id !== propertyId));
      
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  }

  function isInWishlist(propertyId) {
    return wishlist.some(property => property.id === propertyId);
  }

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}