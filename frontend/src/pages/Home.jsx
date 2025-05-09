import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home as HomeIcon, Briefcase, Building, Shield, ArrowRight } from 'lucide-react';
import api from '../utils/axios';
import PropertyCard from '../components/PropertyCard';

function DropdownMenu() {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef(null);

  // Open dropdown and clear any close timer
  const handleMouseEnter = () => {
    setOpen(true);
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
  };

  // Start close timer when mouse leaves
  const handleMouseLeave = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
    }, 3000); // 3 seconds
  };

  // When clicking a link, keep dropdown open for 3 seconds, then close
  const handleLinkClick = (e, href) => {
    e.preventDefault();
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      window.location.href = href;
    }, 3000);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="dropdown-trigger">Dropdown</button>
      {open && (
        <div
          className="dropdown-menu absolute bg-white shadow-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a
            href="/interiors"
            className="block px-4 py-2"
            onClick={e => handleLinkClick(e, "/interiors")}
          >
            Home Interiors
          </a>
          <a
            href="/loans"
            className="block px-4 py-2"
            onClick={e => handleLinkClick(e, "/loans")}
          >
            Home Loans
          </a>
        </div>
      )}
    </div>
  );
}

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        // Fetch the latest 6 properties from Django backend
        const response = await api.get('/properties/', {
          params: {
            ordering: '-created_at',
            limit: 6
          }
        });
        setFeaturedProperties(response.data.results || response.data); // handle pagination or plain list
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results
    window.location.href = `/buy?search=${encodeURIComponent(searchTerm)}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-blue-800/70 z-10"></div>
        <div 
          className="relative h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg')` }}
        >
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-md">
                Find Your Dream Home
              </h1>
              <p className="text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
                Explore thousands of properties and find the perfect place to call home.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSearch} className="flex">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-4 py-3 border-white rounded-l-md focus:ring-primary focus:border-primary"
                      placeholder="Enter location, property type, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-r-md transition-colors duration-200"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
            <Link to="/buy" className="text-primary hover:text-primary-dark font-medium flex items-center">
              View All Properties
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : Array.isArray(featuredProperties) && featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">No properties found. Be the first to list a property!</p>
              <Link to="/sell" className="mt-4 btn-primary inline-block">
                List Your Property
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose Prestige Homes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-primary mb-4">
                <HomeIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Thousands of listings from verified sellers across the country.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600">
                Connect with experienced agents to guide your home buying journey.
              </p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                <Building className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-gray-600">
                All properties are verified to ensure you see only genuine listings.
              </p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Your data and transactions are protected with top-level security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found their perfect home with Prestige Homes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/buy" className="btn-secondary bg-white hover:bg-gray-100">
              Browse Properties
            </Link>
            <Link to="/sell" className="btn-secondary bg-transparent text-white border-white hover:bg-white/10">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;