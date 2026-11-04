import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyGrid } from './components/PropertyGrid';
import { PropertyComparisonTable } from './components/PropertyComparisonTable';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookVisitModal } from './components/BookVisitModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { PROPERTIES } from './data/properties';
import { Property } from './types';

export default function App() {
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPropertyForBooking, setSelectedPropertyForBooking] = useState<Property | null>(null);
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (property?: Property | null) => {
    setSelectedPropertyForBooking(property || null);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
    setSelectedPropertyForBooking(null);
  };

  const handleViewDetails = (property: Property) => {
    setSelectedPropertyForDetail(property);
  };

  const handleCloseDetailModal = () => {
    setSelectedPropertyForDetail(null);
  };

  const handleBookFromCard = (property: Property) => {
    setSelectedPropertyForBooking(property);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0F172A] selection:bg-[#C5A059] selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking(null)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Area */}
      <main>
        {/* Architectural Advisory Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking(null)} />

        {/* Complete List of all 7 Properties Arranged Professionally */}
        <PropertyGrid
          properties={PROPERTIES}
          onBookNow={handleBookFromCard}
          onViewDetails={handleViewDetails}
        />

        {/* Dedicated Property Comparison Matrix Table */}
        <PropertyComparisonTable
          properties={PROPERTIES}
          onSelectProperty={handleViewDetails}
          onBookVisit={handleBookFromCard}
        />

        {/* About Nagpur Acres & Aditya Shivpeth (Founder Profile & Due Diligence) */}
        <AboutSection onOpenBooking={() => handleOpenBooking(null)} />

        {/* Bespoke Client Services & VIP Privileges */}
        <ServicesSection onOpenBooking={() => handleOpenBooking(null)} />

        {/* Contact Us & Direct Inquiry Section */}
        <ContactSection onOpenBooking={() => handleOpenBooking(null)} />
      </main>

      {/* Site Footer */}
      <Footer
        onScrollToSection={handleScrollToSection}
        onOpenBooking={() => handleOpenBooking(null)}
      />

      {/* Sticky Bottom-Right WhatsApp Quick Contact Widget */}
      <FloatingWhatsApp onOpenBooking={() => handleOpenBooking(null)} />

      {/* Detailed Property Specifications Modal */}
      <PropertyDetailModal
        property={selectedPropertyForDetail}
        onClose={handleCloseDetailModal}
        onBookNow={handleBookFromCard}
      />

      {/* Direct WhatsApp Consultation Booking Modal */}
      <BookVisitModal
        isOpen={isBookingOpen}
        onClose={handleCloseBooking}
        selectedProperty={selectedPropertyForBooking}
      />
    </div>
  );
}
