'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-[72px] sm:bottom-6 right-4 sm:right-6 z-[87] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-rose to-rose-dark text-white shadow-lg shadow-rose/25 flex items-center justify-center hover:shadow-xl active:scale-[0.88] transition-all duration-300"
          aria-label="Back to top"
        >
          <HiArrowUp className="text-sm sm:text-base" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
