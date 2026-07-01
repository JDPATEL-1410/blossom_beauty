'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaComments, FaGoogle, FaStar, FaHeart, FaCalendarAlt } from 'react-icons/fa';

const scrollTo = (id: string) => { const el = document.querySelector(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="testimonials" className="relative py-12 sm:py-20 md:py-28 bg-white-warm overflow-hidden">
      <div className="section-divider" />
      <div className="absolute top-1/2 left-0 w-44 sm:w-64 h-44 sm:h-64 rounded-full bg-blush/10 blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-44 sm:w-64 h-44 sm:h-64 rounded-full bg-lavender/10 blur-3xl -translate-y-1/2 pointer-events-none" />

      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/25 text-rose px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 border border-accent/10">
            <FaComments className="text-[8px] sm:text-[10px]" /> CLIENT REVIEWS
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl font-bold text-dark mb-1.5 sm:mb-3">
            Be Our <span className="text-gradient">First Voice</span>
          </h2>
          <p className="text-black font-bold max-w-sm mx-auto text-[13px] sm:text-[15.5px]">
            We're newly opened and excited to serve you! Your experience matters to us.
          </p>
        </motion.div>

        {/* Grand Opening Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-strong rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative overflow-hidden text-center mb-5 sm:mb-6">

          {/* Decorative petals */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="absolute text-3xl opacity-15 animate-gentle-float" style={{ top: '8%', left: '5%' }}>🌸</span>
            <span className="absolute text-2xl opacity-10 animate-gentle-float-alt" style={{ top: '15%', right: '8%', animationDelay: '1s' }}>🌸</span>
            <span className="absolute text-4xl opacity-10 animate-gentle-float" style={{ bottom: '10%', left: '8%', animationDelay: '2s' }}>🌸</span>
            <span className="absolute text-3xl opacity-15 animate-gentle-float-alt" style={{ bottom: '8%', right: '5%', animationDelay: '0.5s' }}>🌸</span>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
          </div>

          {/* Grand Opening Badge */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose to-rose-dark text-white px-4 py-1.5 rounded-full text-[10px] sm:text-[12px] font-bold tracking-wider mb-4 shadow-md shadow-rose/20">
            🎉 GRAND OPENING — WE JUST OPENED!
          </motion.div>

          {/* Stars row */}
          <div className="flex justify-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 250 }}>
                <FaStar className="text-gold text-xl sm:text-2xl" />
              </motion.div>
            ))}
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-bold text-dark mb-3">
            Your Review Will Be First! 💌
          </h3>
          <p className="text-black font-bold text-[15px] sm:text-[17px] leading-relaxed max-w-md mx-auto mb-5">
            We are a <span className="text-rose font-black">freshly opened</span> beauty room and every client is precious to us.
            Book your first appointment, experience our care, and let the world know how you felt!
          </p>

          {/* Feature icons */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { emoji: '✨', label: '5-Star Service' },
              { emoji: '🌸', label: 'Premium Care' },
              { emoji: '💖', label: 'Personal Touch' },
            ].map(f => (
              <div key={f.label} className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 glass-rose rounded-xl flex items-center justify-center text-xl sm:text-2xl">
                  {f.emoji}
                </div>
                <span className="text-[10px] sm:text-[12px] text-black font-bold">{f.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            <a href="https://www.google.com/maps/search/Blossom+Beauty+Room+Douglasville+GA" target="_blank" rel="noopener noreferrer"
              className="btn-glow flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-rose-dark text-white px-6 py-3 rounded-full font-semibold text-[13px] sm:text-sm shadow-md shadow-rose/20 min-h-[44px]">
              <FaGoogle className="text-xs" /> Leave a Review on Google
            </a>
            <button onClick={() => window.location.href='/book'}
              className="btn-rose-outline flex items-center justify-center gap-2 glass text-rose border border-accent/25 px-6 py-3 rounded-full font-semibold text-[13px] sm:text-sm min-h-[44px]">
              <FaCalendarAlt className="text-xs" /> Book Your Visit
            </button>
          </div>
        </motion.div>

        {/* Promise card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blush to-accent/30 flex items-center justify-center flex-shrink-0">
            <FaHeart className="text-rose text-lg" />
          </div>
          <div>
            <p className="font-serif text-sm sm:text-base font-extrabold text-black mb-0.5">Our Promise to You</p>
            <p className="text-[13px] sm:text-[15px] text-black font-bold leading-relaxed">
              Every client who walks through our door gets our full attention and the best beauty care. We can't wait to make you glow! ✨
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
