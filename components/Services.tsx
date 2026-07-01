'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaCut, FaSpa, FaMagic, FaGem, FaEye, FaHandSparkles, FaArrowRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import Image from 'next/image';
import Link from 'next/link';

interface Svc { name: string; price: string; popular?: boolean; revisit?: string; }
interface Cat { name: string; icon: IconType; image: string; desc: string; services: Svc[]; }

const categories: Cat[] = [
  {
    name: 'Threading', icon: FaMagic,
    image: 'https://images.pexels.com/photos/6135620/pexels-photo-6135620.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Precise & gentle hair removal for perfectly shaped brows.',
    services: [
      { name: 'Eyebrows', price: '$7', popular: true, revisit: '3–4 wks' },
      { name: 'Upper Lip', price: '$4', revisit: '3–4 wks' },
      { name: 'Lower Lip', price: '$4', revisit: '4–6 wks' },
      { name: 'Forehead', price: '$5', revisit: '6–8 wks' },
      { name: 'Chin', price: '$5', revisit: '4–6 wks' },
      { name: 'Neck', price: '$5', revisit: '4–6 wks' },
      { name: 'Sideburns', price: '$8', revisit: '5–6 wks' },
      { name: 'Full Face', price: '$30', popular: true, revisit: '3–4 wks' },
    ],
  },
  {
    name: 'Waxing', icon: FaHandSparkles,
    image: 'https://images.pexels.com/photos/5659018/pexels-photo-5659018.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Smooth, long-lasting results with premium products.',
    services: [
      { name: 'Underarms', price: '$10', revisit: '3–4 wks' },
      { name: 'Half Arms', price: '$20', revisit: '4–6 wks' },
      { name: 'Full Arms', price: '$35', revisit: '4–6 wks' },
      { name: 'Half Legs', price: '$25', revisit: '4–5 wks' },
      { name: 'Full Legs', price: '$45', popular: true, revisit: '4–5 wks' },
      { name: 'Back', price: '$35', revisit: '4–6 wks' },
      { name: 'Stomach', price: '$25', revisit: '4–6 wks' },
      { name: 'Brazilian', price: '$30', popular: true, revisit: '4–5 wks' },
    ],
  },
  {
    name: 'Facials', icon: FaSpa,
    image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Rejuvenating treatments for a radiant, youthful glow.',
    services: [
      { name: 'Signature Facial', price: '$50', popular: true, revisit: '4 wks' },
      { name: 'Fruit Facial', price: '$55', revisit: '4–6 wks' },
      { name: 'D-Tan Facial', price: '$65', revisit: '4–6 wks' },
      { name: 'Microdermabrasion', price: '$85', revisit: '4–6 wks' },
      { name: 'Acne Facial', price: '$110', revisit: '2–3 wks' },
      { name: 'Peeling Facial', price: '$110', revisit: '4–6 wks' },
    ],
  },
  {
    name: 'Hair', icon: FaCut,
    image: 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Specialist cuts, color & styling for your unique look.',
    services: [
      { name: 'Hair Cut', price: '$25+', popular: true, revisit: '6–8 wks' },
      { name: 'Hair Styling', price: '$35+', revisit: 'As needed' },
      { name: 'Hair Color', price: '$60+', popular: true, revisit: '6–8 wks' },
      { name: 'Root Touch Up', price: '$45+', revisit: '4–6 wks' },
      { name: 'Hair Treatment', price: '$50+', revisit: '4–6 wks' },
      { name: 'Hair Spa', price: '$55+', revisit: '4 wks' },
    ],
  },
  {
    name: 'Bridal', icon: FaGem,
    image: 'https://images.pexels.com/photos/20695691/pexels-photo-20695691.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Make your special day unforgettable.',
    services: [
      { name: 'Bridal Makeup', price: '$150+', popular: true, revisit: 'Per event' },
      { name: 'Party Makeup', price: '$80+', revisit: 'Per event' },
      { name: 'Hair Styling', price: '$60+', revisit: 'Per event' },
      { name: 'Saree Draping', price: '$40+', revisit: 'Per event' },
      { name: 'Hair, Makeup & Saree', price: '$150+', popular: true, revisit: 'Per event' },
    ],
  },
  {
    name: 'Lashes', icon: FaEye,
    image: 'https://images.pexels.com/photos/8554941/pexels-photo-8554941.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800',
    desc: 'Enhance your natural beauty with perfection.',
    services: [
      { name: 'Eyebrow Tint', price: '$15', revisit: '4–6 wks' },
      { name: 'Brow Tint + Threading', price: '$20', popular: true, revisit: '3–4 wks' },
      { name: 'Lash Tint', price: '$25', revisit: '4–6 wks' },
      { name: 'Lash Enhancement', price: '$45+', revisit: '2–3 wks' },
    ],
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const switchCat = (i: number) => {
    setActive(i);
    if (tabsRef.current) {
      const btn = tabsRef.current.children[i] as HTMLElement;
      btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const cat = categories[active];
  const CatIcon = cat.icon;

  // Ultra-premium ease curve
  const easeCurve = [0.25, 0.46, 0.45, 0.94];

  return (
    <section id="services" className="relative py-16 md:py-28 bg-cream overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8, ease: easeCurve }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="font-sans text-[11px] md:text-[13px] text-primary font-bold uppercase tracking-[0.25em] mb-4 block">
            Our Services
          </span>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-dark mb-4 tracking-tight">
            Curated Beauty Experiences
          </h2>
          <p className="text-black font-bold max-w-lg mx-auto text-[14px] md:text-[16px] leading-relaxed">
            Every treatment is delivered with architectural precision and uncompromising luxury.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={inView ? { opacity: 1 } : {}} 
          transition={{ duration: 1, delay: 0.2, ease: easeCurve }}
          className="mb-10 md:mb-14"
        >
          <div ref={tabsRef} className="flex sm:justify-center gap-2 overflow-x-auto hide-scrollbar px-4 sm:px-0 snap-x snap-mandatory">
            {categories.map((c, i) => {
              const TabIcon = c.icon;
              return (
                <button 
                  key={c.name} 
                  onClick={() => switchCat(i)}
                  className={`snap-center flex-shrink-0 flex items-center gap-2 px-6 py-3 border transition-all duration-500 font-medium tracking-wide text-[13px] sm:text-[14px] ${
                    active === i
                      ? 'border-primary bg-primary text-white shadow-lg'
                      : 'border-primary/20 text-black font-bold hover:border-primary hover:text-primary'
                  }`}
                >
                  <TabIcon className="text-[12px]" />
                  {c.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={active} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start"
          >
            {/* Image Column */}
            <div className="relative overflow-hidden group border border-primary/10 shadow-2xl h-[400px] md:h-[600px]">
              <Image 
                src={cat.image} 
                alt={cat.name} 
                fill 
                unoptimized
                className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-dark/20 transition-colors duration-700 group-hover:bg-dark/10" />
              
              <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-dark/90 to-transparent w-full">
                <CatIcon className="text-white text-3xl mb-3 opacity-90" />
                <h3 className="font-serif text-3xl md:text-4xl text-white font-bold leading-tight mb-2">
                  {cat.name}
                </h3>
                <p className="text-white/80 text-[13px] md:text-[15px] max-w-sm">
                  {cat.desc}
                </p>
              </div>
            </div>

            {/* Services List Column */}
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px bg-primary flex-grow" />
                  <span className="font-sans text-[11px] text-primary/70 uppercase tracking-[0.2em] font-bold">Price List</span>
                  <div className="h-px bg-primary flex-grow" />
                </div>

                <div className="space-y-3">
                  {cat.services.map((svc, i) => (
                    <motion.div 
                      key={svc.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.6, ease: easeCurve }}
                      className="group flex items-center justify-between p-4 border border-primary/20 bg-white hover:bg-primary transition-colors duration-500 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-serif font-bold text-dark text-[17px] group-hover:text-white transition-colors duration-500">
                          {svc.name}
                        </span>
                        {svc.revisit && (
                          <span className="text-[11px] text-black font-bold font-sans mt-0.5 group-hover:text-white transition-colors duration-500 flex items-center gap-1">
                            <FaClock className="text-[10px]" /> Revisit: {svc.revisit}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {svc.popular && (
                          <span className="hidden sm:block text-[9px] uppercase tracking-widest font-bold text-primary border border-primary px-2 py-1 group-hover:border-white group-hover:text-white transition-colors duration-500">
                            Popular
                          </span>
                        )}
                        <span className="font-sans font-bold text-[16px] text-primary group-hover:text-white transition-colors duration-500">
                          {svc.price}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <Link href="/contact" className="flex-1 bg-primary text-white text-center py-4 text-[14px] font-bold tracking-widest uppercase hover:bg-primary-dark transition-colors duration-300">
                  Book Appointment
                </Link>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
