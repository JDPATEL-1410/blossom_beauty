'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, EffectCube, EffectCoverflow, EffectFlip } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-flip';

export default function Hero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ effect: 'fade', autoplayDelay: 5000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        const [slidesRes, settingsRes] = await Promise.all([
          fetch(`${apiUrl}/api/hero`),
          fetch(`${apiUrl}/api/hero/settings`)
        ]);

        if (slidesRes.ok) {
          const data = await slidesRes.json();
          setSlides(data);
        }
        
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          if (settingsData) {
            setSettings(settingsData);
          }
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
      <div className="h-[100dvh] w-full bg-cream flex items-center justify-center pt-[80px]">
        <div className="animate-pulse w-full h-full bg-gray-200"></div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="h-[100dvh] w-full bg-cream flex items-center justify-center pt-[80px]">
        <p className="text-gray-500">No hero slides uploaded yet.</p>
      </div>
    );
  }

  return (
    <section id="hero" className="relative w-full mt-[80px] sm:mt-[92px] lg:mt-[110px] bg-cream">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade, EffectCube, EffectCoverflow, EffectFlip]}
        effect={settings.effect || 'fade'}
        speed={1000}
        autoHeight={true}
        autoplay={{
          delay: settings.autoplayDelay || 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-white !opacity-50',
          bulletActiveClass: 'swiper-pagination-bullet-active !opacity-100 !bg-white',
        }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id} className="w-full">
            {/* Desktop Image */}
            <img
              src={slide.desktopImageUrl}
              alt="Desktop Hero"
              className="hidden md:block w-full h-auto"
              loading="eager"
            />
            {/* Mobile Image */}
            <img
              src={slide.mobileImageUrl}
              alt="Mobile Hero"
              className="block md:hidden w-full h-auto"
              loading="eager"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
