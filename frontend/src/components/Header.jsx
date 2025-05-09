import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, User, Heart, LogOut, LogIn, Menu, X } from 'lucide-react';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState({ loans: false, interiors: false });
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown({ loans: false, interiors: false });
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setShowDropdown(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Home className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">Prestige Homes</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/buy" className="nav-link">Buy</Link>
            <Link to={currentUser ? "/sell" : "/login"} className="nav-link">Sell</Link>
            
            {/* Home Loans Dropdown */}
            <div className="relative group">
              <button 
                className="nav-link flex items-center"
                onClick={() => toggleDropdown('loans')}
                onMouseEnter={() => setShowDropdown(prev => ({...prev, loans: true}))}
                onMouseLeave={() => setShowDropdown(prev => ({...prev, loans: false}))}
              >
                Home Loans
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showDropdown.loans && (
                <div 
                  className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-200 ease-in-out transform origin-top-right"
                  onMouseEnter={() => setShowDropdown(prev => ({...prev, loans: true}))}
                  onMouseLeave={() => setShowDropdown(prev => ({...prev, loans: false}))}
                >
                  <div className="py-1">
                    <Link to="/calculators/eligibility" className="dropdown-item">Loan Eligibility Calculator</Link>
                    <Link to="/calculators/emi" className="dropdown-item">EMI Calculator</Link>
                    <Link to="/calculators/interest-rate" className="dropdown-item">Interest Rate Calculator</Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Home Interiors Dropdown */}
            <div className="relative group">
              <button 
                className="nav-link flex items-center"
                onClick={() => toggleDropdown('interiors')}
                onMouseEnter={() => setShowDropdown(prev => ({...prev, interiors: true}))}
                onMouseLeave={() => setShowDropdown(prev => ({...prev, interiors: false}))}
              >
                Home Interiors
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showDropdown.interiors && (
                <div 
                  className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-200 ease-in-out transform origin-top-right"
                  onMouseEnter={() => setShowDropdown(prev => ({...prev, interiors: true}))}
                  onMouseLeave={() => setShowDropdown(prev => ({...prev, interiors: false}))}
                >
                  <div className="py-1">
                    <Link to="/interiors/luxury-designs" className="dropdown-item">Luxury Designs</Link>
                    <Link to="/interiors/affordable-solutions" className="dropdown-item">Affordable Solutions</Link>
                    <Link to="/interiors/modern-concepts" className="dropdown-item">Modern Concepts</Link>
                  </div>
                </div>
              )}
            </div>
            
            <a href="#footer" className="nav-link">About Us</a>
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/wishlist" className="icon-button">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link to="/profile" className="icon-button">
                  <User className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className="icon-button">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                <LogIn className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4">
            <Link to="/buy" className="mobile-nav-link">Buy</Link>
            <Link to={currentUser ? "/sell" : "/login"} className="mobile-nav-link">Sell</Link>
            
            {/* Mobile Home Loans Dropdown */}
            <div className="space-y-2">
              <button 
                className="w-full flex justify-between items-center mobile-nav-link"
                onClick={() => toggleDropdown('loans')}
              >
                Home Loans
                <svg className={`w-4 h-4 transform ${showDropdown.loans ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showDropdown.loans && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  <Link to="/calculators/eligibility" className="mobile-dropdown-item">Loan Eligibility Calculator</Link>
                  <Link to="/calculators/emi" className="mobile-dropdown-item">EMI Calculator</Link>
                  <Link to="/calculators/interest-rate" className="mobile-dropdown-item">Interest Rate Calculator</Link>
                </div>
              )}
            </div>
            
            {/* Mobile Home Interiors Dropdown */}
            <div className="space-y-2">
              <button 
                className="w-full flex justify-between items-center mobile-nav-link"
                onClick={() => toggleDropdown('interiors')}
              >
                Home Interiors
                <svg className={`w-4 h-4 transform ${showDropdown.interiors ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showDropdown.interiors && (
                <div className="pl-4 space-y-2 border-l-2 border-gray-200">
                  <Link to="/interiors/luxury-designs" className="mobile-dropdown-item">Luxury Designs</Link>
                  <Link to="/interiors/affordable-solutions" className="mobile-dropdown-item">Affordable Solutions</Link>
                  <Link to="/interiors/modern-concepts" className="mobile-dropdown-item">Modern Concepts</Link>
                </div>
              )}
            </div>
            
            <a href="#footer" className="mobile-nav-link">About Us</a>
            
            {/* Mobile user actions */}
            <div className="pt-4 border-t border-gray-200">
              {currentUser ? (
                <div className="space-y-3">
                  <Link to="/wishlist" className="mobile-nav-link flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Wishlist
                  </Link>
                  <Link to="/profile" className="mobile-nav-link flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="mobile-nav-link flex items-center w-full">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary w-full justify-center">
                  <LogIn className="h-5 w-5 mr-1" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;