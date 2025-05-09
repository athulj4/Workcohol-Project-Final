import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import AddProperty from './pages/AddProperty';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import PrivateRoute from './components/PrivateRoute';
import EmiCalculator from './pages/calculators/EmiCalculator';
import EligibilityCalculator from './pages/calculators/EligibilityCalculator';
import InterestRateCalculator from './pages/calculators/InterestRateCalculator';
import InteriorCompany from './pages/interiors/InteriorCompany';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buy" element={<PropertyList />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/calculators/eligibility" element={<EligibilityCalculator />} />
          <Route path="/calculators/emi" element={<EmiCalculator />} />
          <Route path="/calculators/interest-rate" element={<InterestRateCalculator />} />
          <Route path="/interiors/:company" element={<InteriorCompany />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/sell" element={<AddProperty />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;