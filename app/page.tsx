'use client';

import Hero from '@/components/Hero';
import About from '@/components/About';
import SpecialOffers from '@/components/SpecialOffers';
import Testimonials from '@/components/Testimonials';

// We will only import a subset of components for the Home page,
// as the rest will be moved to their respective routes.
// For now, to keep it structurally sound before the split:
export default function Home() {
  return (
    <>
      <Hero />
      <SpecialOffers />
      {/* A condensed About Teaser will be placed here eventually. 
          For now, just showing the original About component. */}
      <About />
      {/* 3-service teaser */}
      {/* Testimonials */}
      <Testimonials />
    </>
  );
}
