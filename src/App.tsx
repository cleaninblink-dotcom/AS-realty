import React, { useState, useEffect } from 'react';
import { Property, FilterState } from './types';
import { PROPERTIES } from './data/properties';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookVisitModal } from './components/BookVisitModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SavedPropertiesModal } from './components/SavedPropertiesModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  subscribeUserFavorites,
  toggleFirestoreFavorite,
  FirestoreFavorite,
} from './lib/firestore-service';

function MainApp() {
  const { user, signInWithGoogle } = useAuth();
  const [properties] = useState<Property[]>(PROPERTIES);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: 'all',
    location: 'all',
    typology: 'all',
    searchQuery: '',
  });

  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingInitialTab, setBookingInitialTab] = useState<'form' | 'list'>('form');
  const [selectedBookingPropertyName, setSelectedBookingPropertyName] = useState<string>('');
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [isSavedPropertiesOpen, setIsSavedPropertiesOpen] = useState(false);

  // User favorites in Firestore
  const [favorites, setFavorites] = useState<Record<string, FirestoreFavorite>>({});

  // Real-time Firestore subscription to user favorites
  useEffect(() => {
    if (!user) {
      setFavorites({});
      return;
    }

    const unsubscribe = subscribeUserFavorites(user.uid, (favMap) => {
      setFavorites(favMap);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  // Synchronize hash for browser back-button & deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#property-')) {
        const id = hash.replace('#property-', '');
        const target = properties.find((p) => String(p.id) === id);
        if (target) {
          setDetailProperty(target);
          return;
        }
      }
      if (detailProperty && !hash.startsWith('#property-')) {
        setDetailProperty(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [properties, detailProperty]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearchSubmit = () => {
    const el = document.getElementById('featured-properties-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (propertyOrName?: Property | string) => {
    setBookingInitialTab('form');
    if (typeof propertyOrName === 'string') {
      setSelectedBookingPropertyName(propertyOrName);
    } else if (propertyOrName && typeof propertyOrName === 'object') {
      setSelectedBookingPropertyName(propertyOrName.name || propertyOrName.title);
    } else {
      setSelectedBookingPropertyName('');
    }
    setIsBookingOpen(true);
  };

  const handleOpenMyBookings = () => {
    setSelectedBookingPropertyName('');
    setBookingInitialTab('list');
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleViewDetails = (property: Property) => {
    setDetailProperty(property);
    if (window.location.hash !== `#property-${property.id}`) {
      window.location.hash = `property-${property.id}`;
    }
  };

  const handleCloseDetails = () => {
    setDetailProperty(null);
    if (window.location.hash.startsWith('#property-')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleToggleFavorite = async (property: Property) => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch {
        return;
      }
    }

    if (user) {
      const isFav = Boolean(favorites[String(property.id)]);
      try {
        await toggleFirestoreFavorite(user.uid, property, isFav);
      } catch (err) {
        console.error('Failed to toggle favorite in Firestore:', err);
      }
    }
  };

  const savedCount = Object.keys(favorites).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#C5A059] selection:text-white">
      {/* Navigation Bar with Google Sign-in and Account Options */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onScrollToSection={handleScrollToSection}
        onOpenSavedProperties={() => setIsSavedPropertiesOpen(true)}
        onOpenMyBookings={handleOpenMyBookings}
        savedCount={savedCount}
      />

      {/* Main Content Area */}
      <main>
        {/* Hero Section */}
        <Hero
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearchSubmit}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* Featured Properties Grid with Interactive Filters & Firestore Favorites */}
        <PropertyGrid
          properties={properties}
          filters={filters}
          onFilterChange={handleFilterChange}
          onBookNow={(prop) => handleOpenBooking(prop)}
          onViewDetails={handleViewDetails}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* About AS Realty & Amit Shivpeth */}
        <AboutSection onOpenBooking={() => handleOpenBooking()} />

        {/* Bespoke Client Services & VIP Privileges */}
        <ServicesSection onOpenBooking={() => handleOpenBooking()} />

        {/* Contact Us & Direct Inquiry Section */}
        <ContactSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Site Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Sticky Bottom-Right WhatsApp Quick Contact Widget */}
      <FloatingWhatsApp onOpenBooking={() => handleOpenBooking()} />

      {/* Interactive Firestore & Supabase Site Visit Booking Modal */}
      <BookVisitModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        selectedPropertyName={selectedBookingPropertyName}
        properties={properties}
        initialTab={bookingInitialTab}
      />

      {/* Property Deep Dive & Gallery Modal */}
      <PropertyDetailModal
        property={detailProperty}
        onClose={handleCloseDetails}
        onBookNow={(prop) => handleOpenBooking(prop)}
        isFavorite={detailProperty ? Boolean(favorites[String(detailProperty.id)]) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Shortlisted Properties Modal */}
      <SavedPropertiesModal
        isOpen={isSavedPropertiesOpen}
        onClose={() => setIsSavedPropertiesOpen(false)}
        favorites={favorites}
        properties={properties}
        onRemoveFavorite={handleToggleFavorite}
        onBookVisit={(prop) => handleOpenBooking(prop)}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
