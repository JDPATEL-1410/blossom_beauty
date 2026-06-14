'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaCertificate, FaPumpSoap, FaSprayCan, FaHandSparkles, FaLeaf, FaGem, FaTrophy, FaUsers, FaConciergeBell, FaStar, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [c, setC] = useState(0);
  const ref = useRef(null);
  const v = useInView(ref, { once: true });
  useEffect(() => {
    if (!v) return;
    let s = 0;
    const step = (t: number) => { if (!s) s = t; const p = Math.min((t - s) / 2000, 1); setC(Math.floor((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [v, target]);
  return <span ref={ref}>{c}{suffix}</span>;
}

const features = [
  { icon: FaCertificate, text: 'Licensed Professionals' },
  { icon: FaPumpSoap, text: 'Premium Products' },
  { icon: FaSprayCan, text: 'Hygienic Studio' },
  { icon: FaHandSparkles, text: 'Personalized Care' },
  { icon: FaLeaf, text: 'Relaxing Atmosphere' },
  { icon: FaGem, text: 'Affordable Luxury' },
];

const stats = [
  { val: 10, sfx: '+', label: 'Years Exp.', icon: FaTrophy, color: 'from-gold/80 to-gold-light' },
  { val: 30, sfx: '+', label: 'Services', icon: FaConciergeBell, color: 'from-rose to-accent' },
  { val: 100, sfx: '%', label: 'Hygienic', icon: FaHandSparkles, color: 'from-accent to-lavender' },
  { val: 5, sfx: '.0', label: 'Rating', icon: FaStar, color: 'from-gold-light to-rose-gold' },
];

const go = (id: string) => { const el = document.querySelector(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="about" className="relative py-12 sm:py-20 md:py-28 overflow-hidden">
      <div className="section-divider" />
      <div className="absolute -top-28 -right-28 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-blush/18 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-lavender/10 blur-3xl pointer-events-none" />
      <Image src="/images/section-flowers.png" alt="" width={208} height={208} className="floral-corner top-0 right-0 w-32 sm:w-52 h-auto opacity-[0.06] rotate-180" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-center">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className="relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group">
              <Image src="/images/about-bg.jpg" alt="Blossom Beauty Room" width={800} height={600} className="w-full h-[240px] sm:h-[340px] md:h-[420px] lg:h-[460px] object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-rose/5 to-transparent" />
            </div>

            {/* Experience badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.4, type: 'spring' }}
              className="absolute -bottom-3 right-1 sm:-bottom-4 sm:right-4 glass-strong rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 shadow-lg animate-gentle-float z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <FaTrophy className="text-white text-[9px] sm:text-xs" />
                </div>
                <div>
                  <p className="font-serif text-lg sm:text-xl text-rose font-bold leading-none">10+ Years</p>
                  <p className="text-[9px] sm:text-[11px] text-dark/45 font-medium">Beauty Excellence</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.6, type: 'spring' }}
              className="absolute -top-2 -left-1 sm:-top-3 sm:-left-3 glass-strong rounded-lg px-2.5 py-1.5 shadow-md animate-gentle-float-alt z-10 hidden sm:flex items-center gap-1.5">
              <FaUsers className="text-rose text-xs" />
              <div>
                <p className="font-serif text-sm text-rose font-bold leading-none">500+</p>
                <p className="text-[9px] text-dark/40">Happy Clients</p>
              </div>
            </motion.div>

            <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-10 sm:w-16 h-10 sm:h-16 border-t-2 border-l-2 border-accent/20 rounded-tl-xl sm:rounded-tl-2xl" />
          </motion.div>

          {/* Content */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }} className="mt-2 lg:mt-0">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/25 text-rose px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 border border-accent/10">
              <FaGem className="text-[8px] sm:text-[10px]" /> ABOUT US
            </span>
            <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-dark mb-3 sm:mb-4 leading-[1.15]">
              Where Beauty <span className="text-gradient">Blossoms</span> Naturally
            </h2>

            <div className="space-y-2.5 sm:space-y-3 text-dark/50 leading-relaxed text-[14px] sm:text-[15px] md:text-[16.5px]">
              <p>At <strong className="text-dark/70">Blossom Beauty Room</strong>, beauty is more than a service — it's an experience. Located inside Bellemay Salon Studios in Douglasville, we provide personalized beauty treatments in our cozy private room designed to enhance your confidence.</p>
              <p>Specialist expertise, premium products, and genuine care — every treatment is tailored just for you.</p>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-1.5 sm:gap-2">
              {features.map((f, i) => (
                <motion.div key={f.text} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 + i * 0.05 }}
                  className="flex items-center gap-2 py-1 group">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-gradient-to-br from-blush to-accent/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="text-rose text-[10px] sm:text-[12px]" />
                  </div>
                  <span className="text-[13px] sm:text-[15px] font-medium text-dark/70 leading-tight">{f.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
              className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
              <button onClick={() => go('#booking')}
                className="flex-1 sm:flex-none btn-glow bg-gradient-to-r from-rose to-rose-dark text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold text-[12px] sm:text-sm shadow-md shadow-rose/15 flex items-center justify-center gap-1.5 min-h-[42px]">
                <FaCalendarAlt className="text-[10px] sm:text-[11px]" /> Book a Visit
              </button>
              <button onClick={() => go('#services')}
                className="flex-1 sm:flex-none btn-rose-outline border border-accent/20 text-rose px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-semibold text-[12px] sm:text-sm flex items-center justify-center gap-1.5 min-h-[42px]">
                Services <FaArrowRight className="text-[8px] sm:text-[9px]" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 sm:mt-12 grid grid-cols-4 gap-2 sm:gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 + i * 0.07 }}
              className="glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center group hover:shadow-lg hover:shadow-rose/6 transition-all duration-300 cursor-default">
              <div className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto mb-1.5 sm:mb-2 rounded-lg sm:rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="text-white text-[11px] sm:text-[13px]" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-rose leading-none">
                <Counter target={s.val} suffix={s.sfx} />
              </p>
              <p className="text-[10px] sm:text-[12px] text-dark/55 mt-0.5 sm:mt-1 font-semibold uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
