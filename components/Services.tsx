'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaCut, FaSpa, FaMagic, FaGem, FaEye, FaHandSparkles, FaArrowRight, FaCalendarAlt, FaClock } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import Image from 'next/image';

interface Svc { name: string; price: string; popular?: boolean; revisit?: string; }
interface Cat { name: string; icon: IconType; color: string; image: string; desc: string; services: Svc[]; }

const categories: Cat[] = [
  {
    name: 'Threading', icon: FaMagic, color: 'from-rose/80 to-accent',
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
    name: 'Waxing', icon: FaHandSparkles, color: 'from-accent to-lavender',
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
    name: 'Facials', icon: FaSpa, color: 'from-lavender to-blush',
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
    name: 'Hair', icon: FaCut, color: 'from-rose-gold to-rose/80',
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
    name: 'Bridal', icon: FaGem, color: 'from-gold to-accent',
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
    name: 'Lashes', icon: FaEye, color: 'from-blush to-rose/70',
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

const scrollTo = (id: string) => { const el = document.querySelector(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };

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

  return (
    <section id="services" className="relative py-12 sm:py-20 md:py-28 bg-white-warm overflow-hidden">
      <div className="section-divider" />
      <div className="absolute top-16 right-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-blush/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 left-0 w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-lavender/8 blur-3xl pointer-events-none" />
      <Image src="/images/section-flowers.png" alt="" width={192} height={192} className="floral-corner bottom-0 left-0 w-28 sm:w-48 h-auto opacity-[0.05]" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/30 text-rose px-3 py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2.5 sm:mb-3 border border-accent/15">
            <FaGem className="text-[7px] sm:text-[8px]" /> OUR SERVICES
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-2 sm:mb-3">
            Premium <span className="text-gradient">Beauty Services</span>
          </h2>
          <p className="text-dark/60 max-w-md mx-auto text-[14px] sm:text-[15.5px] md:text-[17px]">
            Every treatment bloomed with specialist care, delivered with love.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-5 sm:mb-8 -mx-4 sm:mx-0">
          <div ref={tabsRef} className="flex sm:flex-wrap sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar px-4 sm:px-0 pb-1.5 sm:pb-0 snap-x snap-mandatory">
            {categories.map((c, i) => {
              const TabIcon = c.icon;
              return (
                <button key={c.name} onClick={() => switchCat(i)}
                  className={`snap-center flex-shrink-0 flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[15px] font-medium transition-all duration-300 whitespace-nowrap min-h-[36px] sm:min-h-[40px] ${
                    active === i
                      ? 'bg-gradient-to-r from-rose to-rose-dark text-white shadow-md shadow-rose/20'
                      : 'bg-blush/30 text-dark/45 active:scale-[0.96]'
                  }`}>
                  <TabIcon className={`text-[10px] sm:text-[12px] ${active === i ? 'text-white/80' : 'text-accent'}`} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-[1.1fr,1fr] gap-4 sm:gap-6 lg:gap-8 items-start">

            {/* Image card */}
            <div className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg group">
              <Image src={cat.image} alt={cat.name} width={800} height={600} unoptimized={true}
                className="w-full h-44 sm:h-56 md:h-72 lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/15 to-transparent" />

              {/* Category label */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                      <CatIcon className="text-white text-sm sm:text-lg" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg sm:text-2xl text-white font-bold leading-tight">{cat.name}</h3>
                      <p className="text-white/55 text-[10px] sm:text-[12px]">{cat.services.length} services available</p>
                    </div>
                  </div>
                  <div className="glass-strong rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 hidden sm:block">
                    <p className="text-[9px] text-dark/40 font-medium">Starting from</p>
                    <p className="font-serif text-base sm:text-lg font-bold text-rose leading-none">{cat.services[0].price}</p>
                  </div>
                </div>
                <p className="text-white/60 text-[11px] sm:text-[13px] mt-2 leading-relaxed hidden sm:block">{cat.desc}</p>
              </div>
              <div className="absolute top-2.5 left-2.5 sm:hidden">
                <div className="glass-strong rounded-md px-2 py-0.5">
                  <p className="text-[8px] text-dark/40">From <span className="font-serif font-bold text-rose text-[11px]">{cat.services[0].price}</span></p>
                </div>
              </div>
            </div>

            {/* Service list */}
            <div>
              <p className="text-[10px] sm:text-[12px] text-dark/30 font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 px-0.5 flex items-center gap-1.5">
                <span className="w-4 sm:w-6 h-px bg-accent/40" /> Price List
              </p>

              <div className="space-y-1.5 sm:space-y-2">
                {cat.services.map((svc, i) => (
                  <motion.div key={svc.name}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="service-card glass rounded-lg sm:rounded-xl p-2.5 sm:p-3.5 flex items-center justify-between min-h-[44px] sm:min-h-[50px] group cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                      <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${cat.color} group-hover:scale-[2] transition-transform duration-300 flex-shrink-0`} />
                      <div className="min-w-0">
                        <span className="font-medium text-dark/80 text-[15px] sm:text-[16.5px] truncate block">{svc.name}</span>
                        {svc.revisit && (
                          <span className="flex items-center gap-0.5 text-[9px] sm:text-[11px] text-dark/30 font-medium">
                            <FaClock className="text-[8px] text-accent/60" /> Revisit: {svc.revisit}
                          </span>
                        )}
                      </div>
                      {svc.popular && (
                        <span className="hidden sm:inline-flex items-center bg-rose/8 text-rose text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">Popular</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                      {svc.popular && <span className="sm:hidden w-1 h-1 rounded-full bg-rose flex-shrink-0" />}
                      <span className="price-tag">{svc.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Revisit hint */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-3 glass rounded-lg p-2.5 flex items-center gap-2 border border-accent/15">
                <FaClock className="text-accent text-[11px] flex-shrink-0" />
                <p className="text-[11px] sm:text-[12px] text-dark/40 leading-snug">
                  <span className="font-semibold text-dark/55">💡 Revisit Tip:</span>{' '}
                  We'll remind you when it's time to come back for your next {cat.name.toLowerCase()} appointment!
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mt-3 sm:mt-4 flex gap-2 sm:gap-3">
                <button onClick={() => scrollTo('#booking')}
                  className="flex-1 btn-glow bg-gradient-to-r from-rose to-rose-dark text-white py-2.5 sm:py-3 rounded-full font-semibold text-[13px] sm:text-sm tracking-wide shadow-md shadow-rose/12 flex items-center justify-center gap-1.5 min-h-[42px] sm:min-h-[44px]">
                  <FaCalendarAlt className="text-[10px] sm:text-[11px]" /> Book {cat.name}
                </button>
                <button onClick={() => scrollTo('#contact')}
                  className="btn-rose-outline border border-accent/20 text-rose py-2.5 sm:py-3 px-4 sm:px-5 rounded-full font-semibold text-[13px] sm:text-sm flex items-center gap-1.5 min-h-[42px] sm:min-h-[44px] flex-shrink-0">
                  <FaArrowRight className="text-[9px]" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* All categories grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-12 text-center">
          <p className="text-[11px] sm:text-[13px] text-dark/30 mb-3 sm:mb-4 font-medium uppercase tracking-wider">All Categories</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-lg sm:max-w-2xl mx-auto">
            {categories.map((c, i) => {
              const CI = c.icon;
              return (
                <button key={c.name} onClick={() => { switchCat(i); window.scrollTo({ top: (ref.current as HTMLElement | null)?.getBoundingClientRect().top! + window.scrollY - 80, behavior: 'smooth' }); }}
                  className={`glass rounded-lg sm:rounded-xl p-2.5 sm:p-3 flex flex-col items-center gap-1 sm:gap-1.5 group transition-all duration-300 min-h-[60px] sm:min-h-[72px] ${
                    active === i ? 'ring-2 ring-rose/30 shadow-md shadow-rose/8' : 'hover:shadow-md'
                  }`}>
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br ${c.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <CI className="text-white text-[11px] sm:text-[13px]" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-medium text-dark/50 leading-tight">{c.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
