'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FaGem, FaUserMd, FaHeart, FaStar, FaDollarSign, FaSearch, FaShieldAlt, FaSmile, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';

const reasons = [
  { icon: FaGem, title: 'Premium', desc: 'Luxury treatments in a serene environment', color: 'from-blush to-accent/25' },
  { icon: FaUserMd, title: 'Specialist Team', desc: 'Licensed professionals, 10+ years of training', color: 'from-lavender-light to-blush' },
  { icon: FaHeart, title: 'Personalized', desc: 'Tailored to your unique beauty needs', color: 'from-accent/25 to-lavender/15' },
  { icon: FaStar, title: 'Quality', desc: 'Premium, tested beauty products only', color: 'from-blush to-lavender-light' },
  { icon: FaDollarSign, title: 'Affordable', desc: 'High-end services at fair prices', color: 'from-lavender/15 to-blush' },
  { icon: FaSearch, title: 'Detail', desc: 'Meticulous care for perfect results', color: 'from-accent/20 to-blush' },
  { icon: FaShieldAlt, title: 'Hygienic', desc: 'Strict sanitation for your safety', color: 'from-blush to-accent/15' },
  { icon: FaSmile, title: 'Satisfaction', desc: 'Hundreds of glowing reviews', color: 'from-lavender-light to-accent/20' },
];

const go = (id: string) => { const el = document.querySelector(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); };

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="relative py-12 sm:py-20 md:py-28 bg-white-warm overflow-hidden">
      <div className="section-divider" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-blush/8 blur-3xl pointer-events-none" />
      <Image src="/images/section-flowers.png" alt="" width={160} height={160} className="floral-corner top-0 left-0 w-28 sm:w-40 h-auto opacity-[0.05] -scale-x-100" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/25 text-rose px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 border border-accent/10">
            <FaHeart className="text-[8px] sm:text-[10px]" /> THE BLOSSOM DIFFERENCE
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-1.5 sm:mb-3">
            Why Choose <span className="text-gradient">Us</span>
          </h2>
          <p className="text-dark/55 max-w-md mx-auto text-[14px] sm:text-[15.5px]">The premier beauty room in Douglasville, Georgia. Your one-stop private space for all things beautiful.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {reasons.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div key={r.title} initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                className="service-card glass rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-default group">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 mx-auto mb-2 sm:mb-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300`}>
                  <Icon className="text-rose text-sm sm:text-base" />
                </div>
                <h3 className="font-serif text-[14px] sm:text-[15px] font-bold text-dark mb-0.5 sm:mb-1 leading-tight">{r.title}</h3>
                <p className="text-[11.5px] sm:text-[13px] text-dark/55 leading-snug">{r.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-10 relative rounded-xl sm:rounded-2xl overflow-hidden">
          <Image src="/images/cta-bg.jpg" alt="" width={1200} height={300} className="w-full h-28 sm:h-40 md:h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/75 via-dark/55 to-dark/35" />
          <div className="absolute inset-0 flex items-center px-4 sm:px-8 md:px-12">
            <div className="flex-1 text-center sm:text-left">
              <p className="font-script text-lg sm:text-2xl md:text-3xl text-blush mb-0.5 sm:mb-1">Ready to Blossom?</p>
              <p className="text-white/50 text-[11px] sm:text-[13px] md:text-sm max-w-sm">Experience premium beauty care. Your transformation begins here.</p>
            </div>
            <button onClick={() => go('#booking')}
              className="hidden sm:flex btn-glow bg-gradient-to-r from-rose to-accent text-white px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm items-center gap-2 shadow-lg shadow-rose/25 animate-pulse-glow flex-shrink-0">
              <FaCalendarAlt className="text-[9px] sm:text-xs" /> Book Visit
            </button>
          </div>
          {/* Mobile CTA overlay */}
          <button onClick={() => go('#booking')}
            className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 btn-glow bg-gradient-to-r from-rose to-accent text-white px-5 py-2 rounded-full font-semibold text-[11px] flex items-center gap-1.5 shadow-lg min-h-[36px]">
            <FaCalendarAlt className="text-[8px]" /> Book Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
