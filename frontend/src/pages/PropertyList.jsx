import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';
import PropertyCard from '../components/PropertyCard';

function PropertyList() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: '',
    sortBy: 'createdAt_desc'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchProperties = async (isNewSearch = false) => {
    try {
      setLoading(true);
      
      // Parse sort option
      const [sortField, sortDirection] = filters.sortBy.split('_');
      
      let q = collection(db, "properties");
      let constraints = [];
      
      // Apply filters
      if (searchTerm) {
        // Search in title and location (case-insensitive)
        constraints.push(where('title', '>=', searchTerm.toLowerCase()));
        constraints.push(where('title', '<=', searchTerm.toLowerCase() + '\uf8ff'));
        // Note: For a real app, you'd need a more sophisticated search implementation
      }
      
      if (filters.propertyType) {
        constraints.push(where('propertyType', '==', filters.propertyType));
      }
      
      if (filters.minBedrooms) {
        constraints.push(where('bedrooms', '>=', parseInt(filters.minBedrooms)));
      }
      
      if (filters.minBathrooms) {
        constraints.push(where('bathrooms', '>=', parseInt(filters.minBathrooms)));
      }
      
      // Add sort
      constraints.push(orderBy(sortField, sortDirection === 'desc' ? 'desc' : 'asc'));
      
      // Pagination
      constraints.push(limit(9));
      
      if (lastDoc && !isNewSearch) {
        constraints.push(startAfter(lastDoc));
      }
      
      q = query(q, ...constraints);
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setHasMore(false);
        if (isNewSearch) {
          setProperties([]);
        }
        return;
      }
      
      const newProperties = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      
      if (isNewSearch) {
        setProperties(newProperties);
      } else {
        setProperties(prev => [...prev, ...newProperties]);
      }
      
      setHasMore(snapshot.docs.length === 9);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchProperties(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLastDoc(null);
    setHasMore(true);
    fetchProperties(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setLastDoc(null);
    setHasMore(true);
    fetchProperties(true);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      minBathrooms: '',
      sortBy: 'createdAt_desc'
    });
    setLastDoc(null);
    setHasMore(true);
    fetchProperties(true);
    setIsFilterOpen(false);
  };

  const loadMore = () => {
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Your Dream Home</h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                placeholder="Search by location, title, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-1 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
            >
              Search
            </button>
          </form>
          
          {/* Filter Options */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
                <select
                  name="minBedrooms"
                  value={filters.minBedrooms}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Bathrooms</label>
                <select
                  name="minBathrooms"
                  value={filters.minBathrooms}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="createdAt_desc">Newest First</option>
                  <option value="createdAt_asc">Oldest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div className="mb-8">
          {loading && properties.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
              
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      'Load More'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyList;