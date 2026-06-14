'use client';

import { useState, useEffect } from 'react';
import FloatingPetals from '@/components/FloatingPetals';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import SpecialOffers from '@/components/SpecialOffers';
import WhyChooseUs from '@/components/WhyChooseUs';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Booking from '@/components/Booking';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import MobileBookingBar from '@/components/MobileBookingBar';
import AdminPanel from '@/components/AdminPanel';

export default function Home() {
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    
    const handleQuery = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.has('admin')) {
        setAdminOpen(true);
        // Clean up the URL query parameter so it doesn't linger
        const newUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A triggers admin panel
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen(true);
      }
    };

    window.addEventListener('hashchange', handleHash);
    window.addEventListener('keydown', handleKeyDown);

    // Initial check
    handleHash();
    handleQuery();

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (window.location.hash === '#admin') {
      // Reset hash without jumping
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-cream antialiased">
      <FloatingPetals />
      <Navbar />
      <main>
        <Hero />
        <SpecialOffers />
        <About />
        <Services />
        <WhyChooseUs />
        <Gallery />
        <Testimonials />
        <Booking />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <MobileBookingBar />
      {adminOpen && <AdminPanel onClose={handleCloseAdmin} />}
    </div>
  );
}
