'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage, FiAlertCircle, FiSettings, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Slide {
  _id: string;
  desktopImageUrl: string;
  mobileImageUrl: string;
  order: number;
}

export default function HeroAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Settings State
  const [effect, setEffect] = useState('fade');
  const [autoplayDelay, setAutoplayDelay] = useState(5000);
  const [savingSettings, setSavingSettings] = useState(false);

  // Form State
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const [orderIndex, setOrderIndex] = useState<number>(0);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null);

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlidesAndSettings = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const [slidesRes, settingsRes] = await Promise.all([
        fetch(`${apiUrl}/api/hero`),
        fetch(`${apiUrl}/api/hero/settings`)
      ]);

      if (slidesRes.ok) {
        const data = await slidesRes.json();
        setSlides(data);
      }
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData) {
          setEffect(settingsData.effect || 'fade');
          setAutoplayDelay(settingsData.autoplayDelay || 5000);
        }
      }
    } catch (error) {
      toast.error('Failed to load data from server.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlidesAndSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const loadingToast = toast.loading('Saving settings...');
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      
      const res = await fetch(`${apiUrl}/api/hero/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ effect, autoplayDelay })
      });

      if (res.ok) {
        toast.success('Slider settings saved globally!', { id: loadingToast });
      } else {
        toast.error('Failed to save settings.', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Server error saving settings.', { id: loadingToast });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === 'desktop') {
        setDesktopImage(file);
        setDesktopPreview(previewUrl);
      } else {
        setMobileImage(file);
        setMobilePreview(previewUrl);
      }
    }
  };

  const convertToWebP = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
                resolve(webpFile);
              } else {
                resolve(file);
              }
            },
            'image/webp',
            0.95
          );
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadToImgBB = async (originalFile: File) => {
    const webpFile = await convertToWebP(originalFile);
    const formData = new FormData();
    formData.append('image', webpFile);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || 'YOUR_IMGBB_API_KEY_HERE'; 
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const res = await fetch(url, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    }
    throw new Error(data.error?.message || 'Image upload failed');
  };

  const resetForm = () => {
    setEditingId(null);
    setDesktopImage(null);
    setMobileImage(null);
    setDesktopPreview(null);
    setMobilePreview(null);
    setOrderIndex(slides.length > 0 ? Math.max(...slides.map(s => s.order)) + 1 : 0);
    if (desktopInputRef.current) desktopInputRef.current.value = '';
    if (mobileInputRef.current) mobileInputRef.current.value = '';
  };

  const startEdit = (slide: Slide) => {
    setEditingId(slide._id);
    setDesktopPreview(slide.desktopImageUrl);
    setMobilePreview(slide.mobileImageUrl);
    setOrderIndex(slide.order);
    setDesktopImage(null);
    setMobileImage(null);
    if (desktopInputRef.current) desktopInputRef.current.value = '';
    if (mobileInputRef.current) mobileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && (!desktopImage || !mobileImage)) {
      toast.error('Please select both desktop and mobile images.');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading(editingId ? 'Updating slide...' : 'Uploading images and saving...');

    try {
      let finalDesktopUrl = desktopPreview; 
      let finalMobileUrl = mobilePreview;

      if (desktopImage) finalDesktopUrl = await uploadToImgBB(desktopImage);
      if (mobileImage) finalMobileUrl = await uploadToImgBB(mobileImage);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const url = editingId ? `${apiUrl}/api/hero/${editingId}` : `${apiUrl}/api/hero`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          desktopImageUrl: finalDesktopUrl, 
          mobileImageUrl: finalMobileUrl,
          order: orderIndex 
        }),
      });

      if (res.ok) {
        toast.success(editingId ? 'Slide updated successfully!' : 'Slide published successfully!', { id: loadingToast });
        resetForm();
        fetchSlidesAndSettings();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to save slide to database.', { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}. Is your ImgBB API Key valid?`, { id: loadingToast, duration: 5000 });
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setSlideToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!slideToDelete) return;
    setDeleteModalOpen(false);
    const loadingToast = toast.loading('Deleting slide...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/hero/${slideToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Slide deleted.', { id: loadingToast });
        if (editingId === slideToDelete) resetForm();
        fetchSlidesAndSettings();
      } else {
        toast.error('Failed to delete slide.', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Server error deleting slide.', { id: loadingToast });
    } finally {
      setSlideToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Hero Manager</h2>
          <p className="text-gray-500 mt-1">Manage the beautiful full-screen sliders for your homepage.</p>
        </div>
      </div>

      {/* Global Slider Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
          <FiSettings className="text-rose-500" /> Global Slider Settings
        </h3>
        <div className="flex flex-col sm:flex-row gap-6 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Transition Effect</label>
            <select 
              value={effect}
              onChange={(e) => setEffect(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            >
              <option value="slide">Slide (Normal)</option>
              <option value="fade">Fade (Smooth)</option>
              <option value="cube">Cube (3D Box)</option>
              <option value="coverflow">Coverflow (3D Carousel)</option>
              <option value="flip">Flip (3D Card)</option>
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Autoplay Speed (Seconds)</label>
            <select 
              value={autoplayDelay}
              onChange={(e) => setAutoplayDelay(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
            >
              <option value={2000}>2 Seconds (Very Fast)</option>
              <option value={3000}>3 Seconds (Fast)</option>
              <option value={5000}>5 Seconds (Normal)</option>
              <option value={8000}>8 Seconds (Slow)</option>
              <option value={10000}>10 Seconds (Very Slow)</option>
            </select>
          </div>
          <button 
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiSave /> {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Upload / Edit Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            {editingId ? <FiEdit2 className="text-rose-500" /> : <FiPlus className="text-rose-500" />} 
            {editingId ? 'Edit Slide' : 'Add New Slide'}
          </h3>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
              <FiX /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Desktop Image (Wide)</label>
              <div className="relative group border-2 border-dashed border-slate-200 rounded-xl hover:border-rose-300 transition-colors bg-slate-50 overflow-hidden">
                <input 
                  ref={desktopInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'desktop')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-48 flex flex-col items-center justify-center p-4">
                  {desktopPreview ? (
                    <img src={desktopPreview} alt="Desktop Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <FiImage className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">Click or drag image here</p>
                      <p className="text-xs mt-1 text-slate-300">Recommended: 1920x1080</p>
                    </div>
                  )}
                </div>
                {desktopPreview && !desktopImage && editingId && (
                   <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Current Image</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Mobile Image (Portrait)</label>
              <div className="relative group border-2 border-dashed border-slate-200 rounded-xl hover:border-rose-300 transition-colors bg-slate-50 overflow-hidden">
                <input 
                  ref={mobileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'mobile')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-48 flex flex-col items-center justify-center p-4">
                  {mobilePreview ? (
                    <img src={mobilePreview} alt="Mobile Preview" className="h-full w-auto max-w-full object-contain rounded-lg shadow-sm mx-auto" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <FiImage className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">Click or drag image here</p>
                      <p className="text-xs mt-1 text-slate-300">Recommended: 1080x1920</p>
                    </div>
                  )}
                </div>
                {mobilePreview && !mobileImage && editingId && (
                   <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">Current Image</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-6 border-t border-slate-100 pt-6">
            <div className="w-full sm:w-48">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Display Order (Index)</label>
              <input 
                type="number" 
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all"
                min="0"
              />
              <p className="text-xs text-slate-400 mt-1">Lower numbers show first</p>
            </div>
            
            <div className="w-full sm:w-auto sm:ml-auto">
              <button 
                type="submit" 
                disabled={uploading}
                className={`w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-md shadow-slate-200 transition-all ${uploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-rose-500 hover:shadow-rose-200 hover:-translate-y-0.5'}`}
              >
                {uploading ? 'Processing...' : editingId ? 'Save Changes' : 'Publish Slide'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Slides Gallery */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Published Slides <span className="bg-slate-100 text-slate-500 text-sm py-0.5 px-2.5 rounded-full">{slides.length}</span>
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FiImage className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">Your hero slider is currently empty.</p>
            <p className="text-sm text-slate-400 mt-1">Upload your first beautiful slide above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {slides.map((slide) => (
              <div key={slide._id} className={`group bg-white border ${editingId === slide._id ? 'border-rose-400 shadow-md shadow-rose-100' : 'border-slate-100 shadow-sm hover:shadow-md'} rounded-2xl overflow-hidden transition-all duration-300`}>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full">
                    <img src={slide.desktopImageUrl} alt="Desktop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="absolute bottom-[-10px] right-4 w-20 h-32 bg-black border-2 border-white rounded-lg overflow-hidden shadow-xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                    <img src={slide.mobileImageUrl} alt="Mobile" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Order: {slide.order}
                  </div>
                </div>

                <div className="p-4 bg-white flex justify-between items-center border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Slide Controls</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(slide)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Edit Slide"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button 
                      onClick={() => confirmDelete(slide._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Slide"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Delete Slide?</h3>
            <p className="text-center text-slate-500 text-sm mb-6">
              This action cannot be undone. This slide will be permanently removed from your hero slider.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
