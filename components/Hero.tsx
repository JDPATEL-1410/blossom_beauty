'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function Hero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const slidesRes = await fetch(`${apiUrl}/api/hero`);
        if (slidesRes.ok) {
          const data = await slidesRes.json();
          setSlides(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <div className="h-[100dvh] w-full bg-cream flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-primary/10"></div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-[100dvh] w-full bg-cream flex items-center justify-center">
        <p className="text-dark/40 font-serif italic text-xl">Awakening beauty...</p>
      </div>
    );
  }

  return (
    <section id="hero" className="relative w-full h-[100dvh] top-0 bg-dark overflow-hidden">
      
      {/* Inline style for Ken Burns effect scoped to active swiper slide */}
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-slide-active .hero-img-ken-burns {
          transform: scale(1.08);
          transition: transform 12s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .hero-img-ken-burns {
          transform: scale(1);
          transition: transform 1.5s ease-out;
        }
      `}} />

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1500}
        loop={true}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white !opacity-40 !w-2 !h-2 !rounded-none !mx-2',
          bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100',
        }}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide._id} className="w-full h-full relative overflow-hidden">
            {({ isActive }) => (
              <>
                {/* Desktop Image */}
                <img
                  src={slide.desktopImageUrl}
                  alt="Hero"
                  className="hidden md:block w-full h-full object-cover hero-img-ken-burns"
                />
                {/* Mobile Image */}
                <img
                  src={slide.mobileImageUrl}
                  alt="Hero"
                  className="block md:hidden w-full h-full object-cover hero-img-ken-burns"
                />

                {/* Dramatic Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-dark/40" />

                {/* Text Overlay Container */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
                      className="max-w-3xl"
                    >
                      <h1 className="font-serif text-white text-4xl sm:text-6xl lg:text-7xl mb-6 leading-[1.1] tracking-tight drop-shadow-lg">
                        {index === 0 ? "Discover Your" : index === 1 ? "Elevate Your" : "Refine Your"} <br />
                        <span className="font-script text-primary text-5xl sm:text-7xl lg:text-8xl mt-2 block font-normal tracking-normal drop-shadow-md">
                          True Beauty
                        </span>
                      </h1>
                      
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 1.2 }}
                        className="text-white/80 font-sans text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-10 tracking-widest uppercase"
                      >
                        Premium Salon & Aesthetics
                      </motion.p>
                      
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1.8, ease: "easeOut" }}
                      >
                        <a href="/book" className="inline-block bg-primary text-white border border-primary font-bold text-xs sm:text-sm uppercase tracking-[0.2em] px-8 py-4 hover:bg-transparent hover:border-white transition-all duration-500">
                          Book Appointment
                        </a>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
