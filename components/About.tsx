'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaCertificate, FaPumpSoap, FaSprayCan, FaHandSparkles, FaLeaf, FaGem, FaTrophy, FaUsers, FaConciergeBell, FaStar, FaArrowRight, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

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
  { val: 10, sfx: '+', label: 'Years Exp.', icon: FaTrophy },
  { val: 30, sfx: '+', label: 'Services', icon: FaConciergeBell },
  { val: 100, sfx: '%', label: 'Hygienic', icon: FaHandSparkles },
  { val: 5, sfx: '.0', label: 'Rating', icon: FaStar },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const easeCurve: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

  return (
    <section id="about" className="relative py-20 md:py-32 overflow-hidden bg-white">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Asymmetrical Image Section */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }} 
            animate={inView ? { opacity: 1, x: 0 } : {}} 
            transition={{ duration: 1, ease: easeCurve }} 
            className="lg:col-span-5 relative"
          >
            <div className="relative overflow-hidden group border border-primary/10 shadow-2xl">
              <Image 
                src="/images/about-bg.jpg" 
                alt="Blossom Beauty Room" 
                width={800} 
                height={1000} 
                className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.05]" 
              />
              <div className="absolute inset-0 bg-dark/10 transition-colors duration-1000 group-hover:bg-dark/5" />
            </div>

            {/* Experience badge - Sharp Edge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={inView ? { opacity: 1, scale: 1 } : {}} 
              transition={{ delay: 0.6, duration: 0.8, ease: easeCurve }}
              className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-primary p-6 sm:p-8 shadow-xl z-10 hidden sm:block"
            >
              <div className="flex items-center gap-4">
                <FaTrophy className="text-white text-3xl opacity-80" />
                <div>
                  <p className="font-serif text-3xl sm:text-4xl text-white font-bold leading-none">10+ Years</p>
                  <p className="text-[11px] sm:text-[13px] text-white/80 font-sans tracking-widest uppercase mt-1">Beauty Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Minimalist Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }} 
            animate={inView ? { opacity: 1, x: 0 } : {}} 
            transition={{ duration: 1, delay: 0.2, ease: easeCurve }} 
            className="lg:col-span-7 mt-8 lg:mt-0 lg:pl-10"
          >
            <span className="font-sans text-[11px] md:text-[13px] text-primary font-bold uppercase tracking-[0.25em] mb-4 block">
              Our Story
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark mb-8 leading-tight tracking-tight">
              Where Beauty <br />
              <span className="font-script text-primary font-normal text-6xl md:text-7xl lg:text-8xl italic">Blossoms</span> Naturally
            </h2>

            <div className="space-y-6 text-black font-bold font-serif text-[16px] md:text-[18px] lg:text-[20px] leading-relaxed max-w-2xl">
              <p>
                At Blossom Beauty Room, beauty is more than a service — it's an architectural experience of self-care. Located inside Bellemay Salon Studios, we provide personalized beauty treatments in a sanctuary designed to elevate your confidence.
              </p>
              <p>
                Specialist expertise, premium products, and uncompromising attention to detail. Every treatment is tailored strictly for you.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-y-6 gap-x-4 max-w-2xl">
              {features.map((f, i) => (
                <motion.div 
                  key={f.text} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={inView ? { opacity: 1, y: 0 } : {}} 
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: easeCurve }}
                  className="flex items-center gap-4 group"
                >
                  <f.icon className="text-primary text-[16px] group-hover:scale-110 transition-transform duration-500" />
                  <span className="text-[14px] sm:text-[15px] font-sans text-black font-bold tracking-wide">{f.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={inView ? { opacity: 1 } : {}} 
              transition={{ delay: 1, duration: 1, ease: easeCurve }}
              className="mt-14 flex flex-col sm:flex-row gap-4 max-w-md"
            >
              <Link href="/contact" className="flex-1 bg-primary text-white text-center py-4 text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-dark transition-colors duration-500">
                Book a Visit
              </Link>
              <Link href="/services" className="flex-1 border border-primary text-primary text-center py-4 text-[13px] font-bold tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-colors duration-500">
                Services
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ delay: 0.6, duration: 1, ease: easeCurve }}
          className="mt-24 pt-16 border-t border-primary/10 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, i) => (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, y: 20 }} 
              animate={inView ? { opacity: 1, y: 0 } : {}} 
              transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: easeCurve }}
              className="text-center group"
            >
              <s.icon className="text-primary text-2xl mx-auto mb-4 group-hover:-translate-y-1 transition-transform duration-500" />
              <p className="font-serif text-4xl sm:text-5xl font-bold text-dark mb-2">
                <Counter target={s.val} suffix={s.sfx} />
              </p>
              <p className="text-[11px] text-black font-bold font-sans uppercase tracking-[0.25em]">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
