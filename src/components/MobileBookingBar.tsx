import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaPhone } from 'react-icons/fa';

export default function MobileBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[88] sm:hidden mobile-booking-bar">
          <div className="bg-cream/96 backdrop-blur-xl border-t border-accent/15 px-3 py-2 flex items-center gap-2 shadow-[0_-4px_24px_rgba(183,110,121,0.12)]">
            <button onClick={() => {
              const el = document.querySelector('#booking');
              if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
            }}
              className="flex-1 bg-gradient-to-r from-rose to-rose-dark text-white py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-md shadow-rose/20">
              <FaCalendarAlt className="text-xs" /> Book Appointment
            </button>
            <a href="tel:4045931680" className="w-11 h-11 rounded-full glass-rose flex items-center justify-center text-rose active:scale-[0.93] transition-transform flex-shrink-0" aria-label="Call">
              <FaPhone className="text-sm" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
