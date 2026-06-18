'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { FaCamera, FaSearchPlus } from 'react-icons/fa';
import Image from 'next/image';

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [lb, setLb] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const [imgs, setImgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/gallery`);
        if (res.ok) {
          const data = await res.json();
          setImgs(data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const allCats = ['All', ...Array.from(new Set(imgs.map(i => i.cat)))];
  const filtered = filter === 'All' ? imgs : imgs.filter(i => i.cat === filter);

  const nav = useCallback((d: 1 | -1) => setLb(p => { if (p === null) return null; const n = p + d; return n < 0 ? imgs.length - 1 : n >= imgs.length ? 0 : n; }), [imgs]);
  useEffect(() => { if (lb === null) return; const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowLeft') nav(-1); if (e.key === 'ArrowRight') nav(1); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [lb, nav]);

  return (
    <section id="gallery" className="relative py-12 sm:py-20 md:py-28 overflow-hidden">
      <div className="section-divider" />
      <div className="absolute -top-12 right-0 w-40 h-40 rounded-full bg-lavender/10 blur-3xl pointer-events-none" />

      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-5 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blush/50 to-lavender-light/25 text-rose px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[12px] font-semibold tracking-wider mb-2 sm:mb-3 border border-accent/10">
            <FaCamera className="text-[8px] sm:text-[10px]" /> PORTFOLIO
          </span>
          <h2 className="font-serif text-[1.4rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-1.5 sm:mb-3">
            Beauty <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-dark/55 max-w-sm mx-auto text-[14px] sm:text-[15.5px]">Stunning beauty transformations, treatments & our cozy room.</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2.5">
             {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[120px] sm:h-[160px] md:h-[180px] bg-slate-100 rounded-lg animate-pulse"></div>)}
          </div>
        ) : imgs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-dark/40 font-medium">No images in the gallery yet.</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-1 sm:gap-1.5 mb-4 sm:mb-6 -mx-4 sm:mx-0 px-4 sm:px-0">
              {allCats.map(c => (
                <button key={c} onClick={() => setFilter(c)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-[13px] font-medium transition-all duration-300 min-h-[30px] sm:min-h-[34px] ${
                    filter === c ? 'bg-gradient-to-r from-rose to-rose-dark text-white shadow-sm' : 'bg-blush/25 text-dark/40 active:scale-95'
                  }`}>{c}</button>
              ))}
            </motion.div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2.5">
              <AnimatePresence>
                {filtered.map((img, i) => {
                  const gi = imgs.indexOf(img);
                  return (
                    <motion.div key={img._id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.3, delay: i * 0.025 }}
                      className={`gallery-item rounded-lg sm:rounded-xl overflow-hidden cursor-pointer relative group ${i === 0 && filter === 'All' ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                      onClick={() => setLb(gi)}>
                      <Image src={img.src.startsWith('/') ? img.src : img.src} alt={img.alt}
                        width={800} height={600} unoptimized={img.src.startsWith('http')}
                        className={`w-full object-cover ${i === 0 && filter === 'All' ? 'h-[120px] sm:h-full sm:min-h-[280px]' : 'h-[120px] sm:h-[160px] md:h-[180px]'}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-3">
                        <div>
                          <p className="text-white font-serif text-[12px] sm:text-[14px] font-bold">{img.alt}</p>
                          <p className="text-white/45 text-[9px] sm:text-[11px]">{img.cat}</p>
                        </div>
                      </div>
                      <div className="absolute top-1 right-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white">
                          <FaSearchPlus className="text-[8px] sm:text-[10px]" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lb !== null && imgs[lb] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-dark/95 backdrop-blur-lg flex items-center justify-center p-2 sm:p-6" onClick={() => setLb(null)}>
            <button className="absolute top-2 right-2 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/70 z-10" onClick={() => setLb(null)}><HiX size={18} /></button>
            <button className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/60 z-10" onClick={e => { e.stopPropagation(); nav(-1); }}><HiChevronLeft size={18} /></button>
            <button className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white/60 z-10" onClick={e => { e.stopPropagation(); nav(1); }}><HiChevronRight size={18} /></button>
            
            <Image src={imgs[lb].src.replace(/h=\d+/, 'h=900').replace(/w=\d+/, 'w=1200')}
              alt={imgs[lb].alt} width={1200} height={900} unoptimized={imgs[lb].src.startsWith('http')}
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" onClick={e => e.stopPropagation()} />
            
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 glass-rose px-3 py-1.5 rounded-full">
              <span className="text-dark/60 font-serif text-[12px] sm:text-[14px] font-bold">{imgs[lb].alt}</span>
              <span className="text-dark/30 text-[10px] sm:text-[12px] ml-1.5">{lb + 1}/{imgs.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
