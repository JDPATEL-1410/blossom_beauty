'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiHome, HiInformationCircle, HiSparkles, HiTag, HiPhotograph, HiPhone as HiPhoneIcon, HiCalendar } from 'react-icons/hi';
import { FaPhone, FaCalendarAlt } from 'react-icons/fa';

const navLinks = [
  { label: 'Home', href: '#hero', icon: HiHome },
  { label: 'About', href: '#about', icon: HiInformationCircle },
  { label: 'Services', href: '#services', icon: HiSparkles },
  { label: 'Offers', href: '#offers', icon: HiTag },
  { label: 'Gallery', href: '#gallery', icon: HiPhotograph },
  { label: 'Contact', href: '#contact', icon: HiPhoneIcon },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sects = navLinks.map(l => l.href);
      for (let i = sects.length - 1; i >= 0; i--) {
        const el = document.querySelector(sects[i]);
        if (el && el.getBoundingClientRect().top <= 140) {
          setActiveSection(sects[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => { document.body.classList.remove('menu-open'); };
  }, [menuOpen]);

  const go = useCallback((href: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
    }, 80);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 nav-scrolled ${scrolled ? 'py-1.5 sm:py-2' : 'py-3 sm:py-4'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo (Large) */}
          <button onClick={() => go('#hero')} className="flex items-center gap-3.5 sm:gap-4 group min-h-[44px] text-left">
            <div className="relative">
              <img src="/images/logo.png" alt="Blossom Beauty Room" className="w-16 h-16 sm:w-22 sm:h-22 rounded-full object-cover border-2 border-accent/40 group-hover:border-rose transition-all duration-300 group-hover:shadow-xl group-hover:shadow-rose/30" />
              <div className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald rounded-full border-2 border-cream animate-scale-breathe" title="Open Now" />
            </div>
            <div>
              <h1 className="font-script text-xl sm:text-2xl lg:text-[26px] text-rose leading-none transition-colors duration-300 group-hover:text-rose-dark">Blossom Beauty Room</h1>
              <p className="text-[8px] sm:text-[9.5px] tracking-[0.16em] sm:tracking-[0.2em] text-rose-gold/80 uppercase font-sans mt-1">Your Beauty, Our Passion</p>
            </div>
          </button>

          {/* Desktop Nav (Enhanced links & readable fonts) */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5">
            {navLinks.map((link) => (
              <button key={link.label} onClick={() => go(link.href)}
                className={`relative px-4 xl:px-4.5 py-2.5 text-[15px] xl:text-[17px] font-bold tracking-wide transition-all duration-300 rounded-full ${activeSection === link.href ? 'text-rose bg-blush/60' : 'text-dark/70 hover:text-rose hover:bg-blush/30'}`}>
                {link.label}
                {activeSection === link.href && <motion.div layoutId="nav-dot" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-rose" />}
              </button>
            ))}
            <button onClick={() => go('#booking')}
              className="btn-glow ml-3 bg-gradient-to-r from-rose via-accent to-rose-dark text-white px-7 xl:px-8 py-3.5 rounded-full text-[15px] xl:text-[16px] font-bold tracking-wide flex items-center gap-2 shadow-md shadow-rose/25 active:scale-95 transition-transform duration-200">
              <FaCalendarAlt className="text-xs sm:text-sm" /> Book Now
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <a href="tel:4045931680" className="w-12 h-12 rounded-full glass-rose flex items-center justify-center text-rose hover:scale-105 active:scale-95 transition-all duration-200" aria-label="Call us">
              <FaPhone className="text-lg" />
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-12 h-12 rounded-full glass-rose flex items-center justify-center text-dark/70 hover:scale-105 active:scale-95 transition-all duration-200" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-0 z-[99] lg:hidden">
            <div className="absolute inset-0 bg-dark/30 backdrop-blur-md" onClick={() => setMenuOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="absolute right-0 top-0 bottom-0 w-[84%] max-w-[340px] bg-cream shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-accent/15">
                <div className="flex items-center gap-3.5">
                  <img src="/images/logo.png" alt="" className="w-14 h-14 rounded-full object-cover border-2 border-accent/30" />
                  <div>
                    <p className="font-script text-2xl text-rose leading-none">Blossom</p>
                    <p className="text-[9.5px] tracking-[0.18em] text-rose-gold/65 uppercase">Beauty Room</p>
                  </div>
                </div>
                <button onClick={() => setMenuOpen(false)} className="w-11 h-11 rounded-full bg-blush/40 flex items-center justify-center text-dark/60 hover:bg-blush/60 transition-colors" aria-label="Close"><HiX size={22} /></button>
              </div>

              {/* Links (Increased size) */}
              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5">
                {navLinks.map((link, i) => (
                  <motion.button key={link.label} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    onClick={() => go(link.href)}
                    className={`w-full flex items-center gap-4 text-left py-4 px-5 rounded-xl text-[16px] sm:text-[17px] font-bold transition-all duration-200 ${activeSection === link.href ? 'bg-blush/60 text-rose shadow-sm' : 'text-dark/65 active:bg-blush/30'}`}>
                    <link.icon className="text-xl text-accent" />
                    {link.label}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-8 pt-4 border-t border-accent/15 space-y-3.5">
                <button onClick={() => go('#booking')} className="w-full bg-gradient-to-r from-rose to-rose-dark text-white py-4 rounded-full font-bold text-[16px] flex items-center justify-center gap-2.5 shadow-md shadow-rose/25 active:scale-[0.97] transition-all duration-200">
                  <HiCalendar className="text-lg" /> Book Appointment
                </button>
                <a href="tel:4045931680" className="w-full py-3.5 rounded-full font-bold text-[15px] text-center text-rose border-2 border-accent/30 flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200">
                  <FaPhone className="text-sm" /> (404) 593-1680
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
