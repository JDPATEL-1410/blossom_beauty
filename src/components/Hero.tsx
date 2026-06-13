import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { FaCalendarAlt, FaSpa, FaStar, FaAward, FaShieldAlt, FaHeart, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

/* ─────────────────────────────────────────────
   HERO PETALS  (falling from tree branches)
───────────────────────────────────────────── */
interface HeroPetal { id: number; x: number; delay: number; dur: number; size: number; color: string; rot: number; }

const petalColors = ['#E8A4B8', '#F8D7E3', '#CDB4DB', '#FFC0CB', '#FFB7C5', '#FDE8EF'];

function HeroPetals() {
  const [petals, setPetals] = useState<HeroPetal[]>([]);
  useEffect(() => {
    setPetals(Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 38 + Math.random() * 55,   // concentrated around tree area
      delay: Math.random() * 12,
      dur: 5 + Math.random() * 8,
      size: 6 + Math.random() * 10,
      color: petalColors[i % petalColors.length],
      rot: Math.random() * 360,
    })));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {petals.map(p => (
        <div key={p.id} className="hero-petal-fall absolute"
          style={{
            left: `${p.x}%`,
            top: '-2%',
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}>
          <svg viewBox="0 0 24 24" style={{ transform: `rotate(${p.rot}deg)` }}>
            <ellipse cx="12" cy="8" rx="5" ry="9" fill={p.color} opacity="0.85" />
            <ellipse cx="12" cy="8" rx="3" ry="5" fill="white" opacity="0.3" />
          </svg>
        </div>
      ))}
    </div>
  );
}


/* ─────────────────────────────────────────────
   STATS
───────────────────────────────────────────── */
const stats = [
  { icon: FaAward, val: '5+', label: 'Years Exp.' },
  { icon: FaStar, val: '5.0★', label: 'Rating' },
  { icon: FaShieldAlt, val: '100%', label: 'Hygienic' },
  { icon: FaHeart, val: 'New!', label: 'Just Opened' },
];

const scrollTo = (id: string) => {
  const el = document.querySelector(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
};

/* ─────────────────────────────────────────────
   ANIMATED HEADLINE WORDS
───────────────────────────────────────────── */
const headlines = [
  'Flawless Skin', 'Perfect Brows', 'Radiant Glow', 'Bridal Beauty', 'Silky Smooth',
];

export default function Hero() {
  const [hIdx, setHIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setHIdx(p => (p + 1) % headlines.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" className="relative min-h-[100dvh] overflow-hidden bg-cream pt-[80px] sm:pt-[92px] lg:pt-[110px]">

      {/* ── SKY / AMBIENT GRADIENT ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF5F8] via-[#FFF0F5] to-[#F5EAFF]" />
        {/* Soft sun glow top-right */}
        <div className="absolute top-0 right-0 w-[60%] h-[55%] bg-gradient-radial from-[#FFE4EE]/50 to-transparent rounded-full blur-3xl" />
        {/* Soft lavender bottom */}
        <div className="absolute bottom-0 left-0 w-[45%] h-[40%] bg-gradient-radial from-lavender/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* ── HERO PETALS from TREE ── */}
      <HeroPetals />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 min-h-[calc(100dvh-80px)] sm:min-h-[calc(100dvh-92px)] lg:min-h-[calc(100dvh-110px)] flex flex-col lg:grid lg:grid-cols-2 lg:items-center">

        {/* ══════════ TEXT SIDE ══════════ */}
        <div className="order-2 lg:order-1 flex flex-col justify-center py-6 sm:py-8 lg:py-0 text-center lg:text-left">

          {/* Brand badge */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 glass-rose px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[11px] font-semibold tracking-widest text-rose border border-accent/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-scale-breathe" />
              🌸 BLOSSOM BEAUTY ROOM — NOW OPEN
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-[1.7rem] leading-[1.1] sm:text-[2.4rem] md:text-[3rem] lg:text-[3.4rem] font-bold text-dark mt-3 sm:mt-4 mb-1 sm:mb-2"
          >
            Bloom Into
            <br />
            <AnimatePresence mode="wait">
              <motion.span key={hIdx}
                initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                transition={{ duration: 0.4 }}
                className="text-gradient inline-block"
              >
                {headlines[hIdx]}
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[12px] sm:text-[14px] md:text-[15px] text-dark/50 max-w-md mx-auto lg:mx-0 mb-4 sm:mb-5 leading-relaxed"
          >
            Expert threading, waxing, facials, hair styling, bridal makeup &amp; lash services —{' '}
            <span className="text-dark/70 font-medium">crafted with care, under our blossom tree.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="flex gap-2.5 sm:gap-3 justify-center lg:justify-start mb-4 sm:mb-5"
          >
            <button onClick={() => scrollTo('#booking')}
              className="btn-glow animate-pulse-glow flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-rose-dark text-white px-5 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold text-[12px] sm:text-sm tracking-wide shadow-lg shadow-rose/25 min-h-[44px]">
              <FaCalendarAlt className="text-[10px] sm:text-xs" /> Book Appointment
            </button>
            <button onClick={() => scrollTo('#services')}
              className="btn-rose-outline flex-1 sm:flex-none flex items-center justify-center gap-2 glass text-rose border border-accent/25 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-[12px] sm:text-sm tracking-wide min-h-[44px]">
              <FaSpa className="text-[10px] sm:text-xs" /> Services
            </button>
          </motion.div>

          {/* Contact row */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="flex justify-center lg:justify-start gap-4 sm:gap-5 mb-4 sm:mb-5">
            <a href="tel:4045931680" className="flex items-center gap-1.5 text-[10px] sm:text-[12px] text-dark/45 hover:text-rose transition-colors">
              <FaPhoneAlt className="text-rose text-[8px] sm:text-[9px]" /> (404) 593-1680
            </a>
            <span className="flex items-center gap-1.5 text-[10px] sm:text-[12px] text-dark/35">
              <FaMapMarkerAlt className="text-rose text-[8px] sm:text-[9px]" /> Douglasville, GA
            </span>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="grid grid-cols-4 gap-2 max-w-xs sm:max-w-sm mx-auto lg:mx-0"
          >
            {stats.map((st, i) => (
              <motion.div key={st.label}
                initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75 + i * 0.07, type: 'spring', stiffness: 220 }}
                className="glass-strong rounded-xl py-2 sm:py-2.5 flex flex-col items-center cursor-default group hover:shadow-md transition-all duration-300"
              >
                <st.icon className="text-rose text-[9px] sm:text-[11px] mb-0.5 group-hover:scale-110 transition-transform" />
                <span className="font-serif font-bold text-dark text-[11px] sm:text-[13px] leading-none">{st.val}</span>
                <span className="text-[5px] sm:text-[6.5px] font-medium text-dark/30 uppercase tracking-wider mt-px text-center leading-tight">{st.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ══════════ TREE SCENE SIDE (NOW REALISTIC IMAGE) ══════════ */}
        <div className="order-1 lg:order-2 relative w-full flex items-center justify-center pt-6 lg:pt-0 pb-6 lg:pb-0"
          style={{ height: 'clamp(380px, 55vw, 620px)', maxHeight: '660px' }}>

          {/* Soft glow behind image */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ repeat: Infinity, duration: 7 }}
            className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[75%] h-[75%] rounded-full bg-gradient-radial from-blush/60 via-accent/20 to-transparent blur-3xl pointer-events-none"
          />

          {/* Realistic Image Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-[88%] xs:w-[80%] sm:w-[70%] md:w-[60%] lg:w-[92%] xl:w-[86%] aspect-[4/5] rounded-[2rem] overflow-hidden border-[6px] border-white shadow-2xl shadow-rose/15 group z-10"
          >
            <img 
              src="/images/hero-realistic.png" 
              alt="Luxury Beauty Session under Blossom Tree" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Soft vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-rose/15 via-transparent to-transparent pointer-events-none" />
          </motion.div>


        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
        className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-10">
        <motion.button onClick={() => scrollTo('#about')}
          animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}
          className="flex flex-col items-center gap-1 group" aria-label="Scroll down">
          <span className="text-[7px] text-dark/25 font-medium uppercase tracking-widest">Scroll</span>
          <div className="w-4 h-7 rounded-full border border-rose/15 flex justify-center pt-1.5">
            <motion.div animate={{ height: [3, 9, 3], opacity: [0.18, 0.5, 0.18] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="w-px bg-rose/35 rounded-full" />
          </div>
        </motion.button>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent pointer-events-none z-10" />
    </section>
  );
}
