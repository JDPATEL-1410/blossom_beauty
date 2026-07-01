'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const easeCurve: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Run once to check initial scroll
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => { document.body.classList.remove('menu-open'); };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // If we're on the home page, the top is dark (hero image), so text should be white when not scrolled.
  // If we're on other pages, it depends on the layout, but let's assume a universal elegant style.
  const isHome = pathname === '/';
  const navTextColor = menuOpen ? 'text-black' : ((isHome && !scrolled) ? 'text-white' : 'text-black');
  const navBg = scrolled ? 'bg-white shadow-sm border-b border-primary/10' : 'bg-transparent border-b border-transparent';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: easeCurve }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${navBg} ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-4 group text-left z-10 w-1/4">
            <img 
              src="/images/logo.png" 
              alt="Blossom Beauty Room" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain hover:scale-105 transition-transform duration-500" 
            />
            <div>
              <h1 className={`font-script text-3xl md:text-4xl font-bold py-1 ${isHome && !scrolled && !menuOpen ? 'text-white' : 'text-metallic-rose'}`}>Blossom</h1>
              <p className={`text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase font-sans mt-0.5 transition-colors duration-300 ${isHome && !scrolled && !menuOpen ? 'text-white' : 'text-black'}`}>Beauty Room</p>
            </div>
          </Link>

          {/* Links - Center */}
          <div className="hidden lg:flex items-center justify-center gap-10 w-2/4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}
                className={`relative text-[13px] lg:text-[14px] font-black uppercase tracking-[0.2em] transition-all duration-300 py-2 ${
                  pathname === link.href 
                    ? (isHome && !scrolled ? 'text-white/80' : 'text-primary') 
                    : `${navTextColor} hover:text-primary`
                }`}>
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Action - Right */}
          <div className="hidden lg:flex items-center justify-end w-1/4">
            <Link href="/contact"
              className={`px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.2em] border transition-all duration-500 ${
                isHome && !scrolled 
                  ? 'border-white text-white hover:bg-white hover:text-dark' 
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}>
              Book Visit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden z-10">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className={`w-12 h-12 flex items-center justify-end transition-colors duration-300 ${navTextColor} relative z-[105]`} 
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <div className="flex flex-col items-end justify-center gap-[6px]">
                <span className={`block h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${menuOpen ? 'w-7 rotate-45 translate-y-[3.75px]' : 'w-7'}`} />
                <span className={`block h-[1.5px] bg-current transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${menuOpen ? 'w-7 -rotate-45 -translate-y-[3.75px]' : 'w-5'}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Side Slide-in Architectural Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-[98] bg-dark/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }} 
              className="fixed inset-0 z-[99] bg-white flex flex-col justify-center pt-28 pb-8 px-6 md:px-16 lg:hidden overflow-y-auto"
            >
              <div className="max-w-2xl w-full mx-auto my-auto">
              <span className="font-sans text-[11px] text-primary font-bold uppercase tracking-[0.3em] mb-12 block text-center">
                Navigation
              </span>
              
              <div className="flex flex-col gap-6 text-center">
                {navLinks.map((link, i) => (
                  <motion.div 
                    key={link.label} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: easeCurve }}
                  >
                    <Link href={link.href}
                      className={`text-3xl md:text-5xl font-serif tracking-tight transition-all duration-500 hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-dark'}`}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.8, duration: 0.8, ease: easeCurve }}
                className="mt-16 text-center"
              >
                <Link href="/contact" className="inline-block border border-primary text-primary px-12 py-4 text-[12px] font-bold uppercase tracking-[0.25em] hover:bg-primary hover:text-white transition-colors duration-500">
                  Book Appointment
                </Link>
              </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
