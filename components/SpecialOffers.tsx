'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { FaStar, FaTag, FaGift, FaBolt, FaPercentage, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';

const iconMap: Record<string, React.ElementType> = {
  FaStar: FaStar,
  FaTag: FaTag,
  FaGift: FaGift,
  FaBolt: FaBolt,
};

const go = (id: string) => { 
  const el = document.querySelector(id); 
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); 
};

export default function SpecialOffers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const easeCurve = [0.25, 0.46, 0.45, 0.94];

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/offers`);
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <section id="offers" className="relative py-24 md:py-32 bg-white overflow-hidden">
      
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease: easeCurve }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-transparent text-black px-4 py-1 border border-black text-[10px] font-extrabold tracking-[0.2em] uppercase mb-6">
            <FaPercentage className="text-[10px]" /> Exclusive Deals
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black mb-6 tracking-tight">
            Special <span className="text-gradient">Beauty Offers</span>
          </h2>
          {/* Changed to pure black text and bolder as requested */}
          <p className="text-black font-extrabold max-w-lg mx-auto text-[14px] md:text-[15px] leading-relaxed uppercase tracking-widest">
            Limited time deals to celebrate our grand opening. Book today and save!
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[400px] bg-cream animate-pulse border border-primary/10"></div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-20 border border-primary/20 bg-cream">
            <p className="text-black font-extrabold tracking-widest uppercase text-sm">No special offers at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((o, i) => {
              const Icon = iconMap[o.icon] || FaStar;
              return (
                <motion.div key={o._id}
                  initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.1 * i, ease: easeCurve }}
                  className="group cursor-pointer border border-primary/20 hover:border-primary transition-colors duration-500 bg-white"
                  onClick={() => go('#booking')}
                >
                  {/* Background image */}
                  <div className="relative h-[250px] overflow-hidden bg-dark">
                    <Image src={o.image} alt={o.title} width={400} height={400} unoptimized={true}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 bg-white text-black text-[10px] font-extrabold uppercase tracking-[0.1em] px-3 py-1">
                        <Icon className="text-[10px]" /> {o.badge}
                      </span>
                    </div>

                    {/* Price Info overlaid at bottom left */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-end gap-3">
                      <span className="text-white/70 line-through text-[12px] font-bold">{o.orig}</span>
                      <span className="font-serif text-[28px] font-bold text-white leading-none">{o.price}</span>
                    </div>
                  </div>

                  {/* Content below image */}
                  <div className="p-6">
                    <h3 className="font-serif text-[22px] font-bold text-black mb-4">{o.title}</h3>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">Save {o.save}</span>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); go('#booking'); }}
                      className="w-full bg-transparent border border-black text-black py-4 text-[11px] font-extrabold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors duration-500 flex items-center justify-center gap-2">
                      <FaCalendarAlt className="text-[11px]" /> Book Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.6, ease: easeCurve }}
          className="mt-16 flex flex-wrap justify-center gap-8">
          {[
            { icon: FaGift, text: 'Referral Discounts' },
            { icon: FaStar, text: 'Seasonal Promos' },
            { icon: FaTag, text: 'Gift Cards Available' },
          ].map(t => (
            // Changed to pure black text and bolder as requested
            <span key={t.text} className="flex items-center gap-2 text-[11px] md:text-[12px] text-black font-extrabold uppercase tracking-[0.15em]">
              <t.icon className="text-primary text-[12px]" /> {t.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
