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
    <section id="offers" className="relative py-12 sm:py-20 md:py-28 overflow-hidden">
      <div className="section-divider" />
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-6 left-1/4 w-32 sm:w-44 h-32 sm:h-44 rounded-full bg-blush/12 blur-3xl pointer-events-none" />
      <div className="absolute bottom-6 right-1/4 w-36 sm:w-52 h-36 sm:h-52 rounded-full bg-lavender/10 blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-1.5 bg-rose/8 text-rose px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 animate-border-glow border border-accent/15">
            <FaPercentage className="text-[8px] sm:text-[10px]" /> EXCLUSIVE DEALS
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-1.5 sm:mb-3">
            Special <span className="text-gradient">Beauty Offers</span>
          </h2>
          <p className="text-dark/80 max-w-md mx-auto text-[14px] sm:text-[15.5px]">Limited time deals to celebrate our grand opening. Book today and save!</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[260px] sm:h-[300px] bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-dark/40 font-medium">No special offers at the moment. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {offers.map((o, i) => {
              const Icon = iconMap[o.icon] || FaStar;
              return (
                <motion.div key={o._id}
                  initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.08 + i * 0.08 }}
                  className="service-card relative group rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-rose/15 transition-all duration-500"
                  onClick={() => go('#booking')}
                >
                  {/* Background image */}
                  <div className="relative h-[160px] sm:h-[200px] md:h-[220px] overflow-hidden bg-slate-900">
                    <Image src={o.image} alt={o.title} width={400} height={400} unoptimized={true}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/30 to-transparent" />
                    {/* Blossom petals overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <span className="absolute text-xl opacity-60 animate-gentle-float" style={{ top: '10%', right: '12%' }}>🌸</span>
                      <span className="absolute text-lg opacity-40 animate-gentle-float-alt" style={{ top: '40%', left: '8%', animationDelay: '1s' }}>🌸</span>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="animate-ribbon inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/30 shadow-sm">
                        <Icon className="text-[8px] sm:text-[10px]" /> {o.badge}
                      </span>
                    </div>

                    {/* Price overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3.5">
                      <h3 className="font-serif text-[14px] sm:text-[17px] font-bold text-white mb-1 leading-tight drop-shadow">{o.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 line-through text-[11px] sm:text-[13px]">{o.orig}</span>
                        <span className="font-serif text-[19px] sm:text-[24px] font-bold text-white drop-shadow">{o.price}</span>
                        <span className="ml-auto bg-emerald/80 text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                          Save {o.save}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Book button */}
                  <div className="bg-white p-2 sm:p-3">
                    <button
                      onClick={() => go('#booking')}
                      className="btn-glow w-full bg-gradient-to-r from-rose to-rose-dark text-white py-2 sm:py-2.5 rounded-full text-[12px] sm:text-[14px] font-semibold flex items-center justify-center gap-1.5 shadow-sm min-h-[34px] sm:min-h-[38px]">
                      <FaCalendarAlt className="text-[9px] sm:text-[11px]" /> Book Now
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.5 }}
          className="mt-5 sm:mt-8 flex flex-wrap justify-center gap-1.5 sm:gap-3">
          {[
            { icon: FaGift, text: 'Referral Discounts' },
            { icon: FaStar, text: 'Seasonal Promos' },
            { icon: FaTag, text: 'Gift Cards Available' },
          ].map(t => (
            <span key={t.text} className="flex items-center gap-1 sm:gap-1.5 glass px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] text-dark/40 font-medium">
              <t.icon className="text-rose text-[9px] sm:text-[11px]" /> {t.text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
