import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaUpload, FaTrash, FaEye, FaImage, FaCheck, FaTimes } from 'react-icons/fa';

interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  cat: string;
  addedAt: string;
  isAdminUploaded: boolean;
}

const CATS = ['Threading', 'Waxing', 'Facials', 'Hair', 'Bridal', 'Lashes', 'Salon', 'Other'];

function getGalleryItems(): GalleryItem[] {
  try { return JSON.parse(localStorage.getItem('blossom_gallery') || '[]'); } catch { return []; }
}
function saveGalleryItems(items: GalleryItem[]) {
  localStorage.setItem('blossom_gallery', JSON.stringify(items));
}

interface Props { onUpdate?: () => void; }

export default function GalleryManager({ onUpdate }: Props) {
  const [items, setItems] = useState<GalleryItem[]>(getGalleryItems());
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [cat, setCat] = useState('Salon');
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const b64 = ev.target?.result as string;
      setFileBase64(b64);
      setUrl('');
      setPreview(b64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUrlChange = (v: string) => {
    setUrl(v);
    setFileBase64(null);
    setPreview(v || null);
  };

  const addItem = () => {
    const src = fileBase64 || url.trim();
    if (!src || !alt.trim()) { showToast('❌ Please provide image & description'); return; }
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      url: src,
      alt: alt.trim(),
      cat,
      addedAt: new Date().toLocaleDateString('en-IN'),
      isAdminUploaded: true,
    };
    const updated = [newItem, ...items];
    saveGalleryItems(updated);
    setItems(updated);
    setUrl(''); setAlt(''); setFileBase64(null); setPreview(null);
    showToast('✅ Photo added to gallery!');
    onUpdate?.();
  };

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    saveGalleryItems(updated);
    setItems(updated);
    showToast('🗑️ Photo removed');
    onUpdate?.();
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-[999] glass-strong rounded-xl px-4 py-2.5 shadow-lg text-sm font-medium text-dark border border-accent/20">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload form */}
      <div className="glass-strong rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="font-serif text-base sm:text-lg font-bold text-dark flex items-center gap-2">
          <FaUpload className="text-rose text-sm" /> Add Photo to Gallery
        </h3>

        {/* File upload */}
        <label className="block border-2 border-dashed border-accent/30 rounded-xl p-4 text-center cursor-pointer hover:border-rose/40 transition-colors bg-blush/5 hover:bg-blush/10">
          <FaCamera className="text-accent text-2xl mx-auto mb-1" />
          <p className="text-[11px] text-dark/50 font-medium">Click to upload from device</p>
          <p className="text-[9px] text-dark/30">JPG, PNG, WEBP accepted</p>
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>

        <p className="text-center text-[9px] text-dark/30 font-medium">— or paste image URL —</p>

        <input type="url" value={url} onChange={e => handleUrlChange(e.target.value)}
          placeholder="https://example.com/photo.jpg"
          className="w-full px-3 py-2.5 rounded-xl border border-accent/20 bg-white/50 focus:border-rose outline-none text-sm text-dark/70 placeholder:text-dark/20" />

        {preview && (
          <div className="relative rounded-xl overflow-hidden h-36 border border-accent/20">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => { setPreview(null); setUrl(''); setFileBase64(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-dark/50 flex items-center justify-center text-white">
              <FaTimes className="text-xs" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[9px] font-semibold text-dark/40 uppercase tracking-wider mb-1">Description *</label>
            <input type="text" value={alt} onChange={e => setAlt(e.target.value)}
              placeholder="e.g. Bridal Makeup Look"
              className="w-full px-3 py-2.5 rounded-xl border border-accent/20 bg-white/50 focus:border-rose outline-none text-sm text-dark/70 placeholder:text-dark/20" />
          </div>
          <div>
            <label className="block text-[9px] font-semibold text-dark/40 uppercase tracking-wider mb-1">Category</label>
            <select value={cat} onChange={e => setCat(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-accent/20 bg-white/50 focus:border-rose outline-none text-sm text-dark/70">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button onClick={addItem}
          className="w-full bg-gradient-to-r from-rose to-rose-dark text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose/15">
          <FaCheck className="text-xs" /> Add to Gallery
        </button>
      </div>

      {/* Uploaded photos */}
      <div className="glass-strong rounded-2xl p-4 sm:p-5">
        <h3 className="font-serif text-base font-bold text-dark mb-3 flex items-center gap-2">
          <FaImage className="text-rose text-sm" /> Uploaded Photos ({items.length})
        </h3>
        {items.length === 0 ? (
          <div className="text-center py-8 text-dark/30">
            <FaCamera className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="text-sm">No photos uploaded yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {items.map(item => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-xl overflow-hidden group">
                <img src={item.url} alt={item.alt} className="w-full h-28 object-cover" />
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <a href={item.url} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <FaEye className="text-xs" />
                  </a>
                  <button onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-full bg-red-500/70 backdrop-blur flex items-center justify-center text-white">
                    <FaTrash className="text-xs" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark/70 to-transparent p-1.5">
                  <p className="text-white text-[8px] font-medium truncate">{item.alt}</p>
                  <span className="text-white/60 text-[7px]">{item.cat} · {item.addedAt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
