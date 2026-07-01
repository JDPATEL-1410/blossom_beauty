'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { HiX, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import Image from 'next/image';

export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [lb, setLb] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const [imgs, setImgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const easeCurve = [0.25, 0.46, 0.45, 0.94];

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
  
  useEffect(() => { 
    if (lb === null) return; 
    const h = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') setLb(null); 
      if (e.key === 'ArrowLeft') nav(-1); 
      if (e.key === 'ArrowRight') nav(1); 
    }; 
    window.addEventListener('keydown', h); 
    return () => window.removeEventListener('keydown', h); 
  }, [lb, nav]);

  return (
    <section id="gallery" className="relative py-20 md:py-32 bg-cream overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={inView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8, ease: easeCurve }} 
          className="text-center mb-12 md:mb-20"
        >
          <span className="font-sans text-[11px] md:text-[13px] text-primary font-bold uppercase tracking-[0.25em] mb-4 block">
            Portfolio
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-dark mb-4 tracking-tight">
            Beauty <span className="text-gradient">Archive</span>
          </h2>
          <p className="text-black font-bold max-w-md mx-auto text-[14px] md:text-[16px] leading-relaxed">
            A curated editorial of our finest transformations and treatments.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
             {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-[200px] md:h-[300px] bg-primary/5 animate-pulse border border-white"></div>)}
          </div>
        ) : imgs.length === 0 ? (
          <div className="text-center py-20 border border-primary/20 bg-white">
            <p className="text-dark/40 font-serif italic text-xl">The gallery is currently being curated.</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={inView ? { opacity: 1 } : {}} 
              transition={{ delay: 0.2, duration: 1, ease: easeCurve }}
              className="flex flex-wrap justify-center gap-4 mb-10 md:mb-16"
            >
              {allCats.map(c => (
                <button 
                  key={c} 
                  onClick={() => setFilter(c)}
                  className={`text-[11px] md:text-[13px] font-bold uppercase tracking-[0.2em] transition-all duration-500 px-5 py-2 rounded-full border ${
                    filter === c ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-primary/20 text-black hover:border-primary hover:text-primary'
                  }`}
                >
                  {c}
                </button>
              ))}
            </motion.div>

            {/* Gapless Grid Layout */}
            <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-white">
              <AnimatePresence>
                {filtered.map((img, i) => {
                  const gi = imgs.indexOf(img);
                  // Make the first image span 2x2 if viewing 'All' for editorial feel
                  const isFeatured = i === 0 && filter === 'All';
                  
                  return (
                    <motion.div 
                      key={img._id} 
                      layout 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: easeCurve }}
                      className={`relative group overflow-hidden cursor-pointer border border-white bg-dark ${isFeatured ? 'col-span-2 row-span-2' : ''}`}
                      onClick={() => setLb(gi)}
                    >
                      <Image 
                        src={img.src} 
                        alt={img.alt}
                        width={1000} height={1000} 
                        unoptimized={img.src.startsWith('http')}
                        className={`w-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-105 group-hover:grayscale group-hover:opacity-40 ${isFeatured ? 'h-[400px] md:h-[600px]' : 'h-[200px] md:h-[300px]'}`} 
                      />
                      
                      {/* Monochromatic Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                        <span className="text-white border border-white px-6 py-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] backdrop-blur-sm">
                          View
                        </span>
                      </div>

                      {/* Info on hover (bottom left) */}
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-2 group-hover:translate-y-0">
                        <p className="text-white font-serif text-lg md:text-xl font-bold leading-tight drop-shadow-md">{img.alt}</p>
                        <p className="text-white/70 text-[9px] md:text-[10px] uppercase tracking-widest font-sans mt-1">{img.cat}</p>
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.4, ease: easeCurve }}
            className="fixed inset-0 z-[500] bg-dark/98 flex items-center justify-center p-4" 
            onClick={() => setLb(null)}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10" onClick={() => setLb(null)}>
              <HiX size={32} />
            </button>
            <button className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-10" onClick={e => { e.stopPropagation(); nav(-1); }}>
              <HiChevronLeft size={48} />
            </button>
            <button className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-10" onClick={e => { e.stopPropagation(); nav(1); }}>
              <HiChevronRight size={48} />
            </button>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.6, ease: easeCurve }}
              className="relative max-w-[90vw] max-h-[85vh]"
            >
              <Image 
                src={imgs[lb].src.replace(/h=\d+/, 'h=1200').replace(/w=\d+/, 'w=1600')}
                alt={imgs[lb].alt} 
                width={1600} 
                height={1200} 
                unoptimized={imgs[lb].src.startsWith('http')}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl ring-1 ring-white/10" 
                onClick={e => e.stopPropagation()} 
              />
              <div className="absolute -bottom-10 left-0 w-full flex justify-between items-center px-2">
                <span className="text-white/80 font-serif text-lg tracking-wide">{imgs[lb].alt}</span>
                <span className="text-white/40 font-sans text-xs tracking-widest">{lb + 1} / {imgs.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
