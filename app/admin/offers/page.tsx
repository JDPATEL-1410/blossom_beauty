'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { FaStar, FaTag, FaGift, FaBolt } from 'react-icons/fa';

interface Offer {
  _id: string;
  title: string;
  orig: string;
  price: string;
  save: string;
  badge: string;
  icon: string;
  image: string;
  order: number;
}

export default function OffersAdminPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [orig, setOrig] = useState('');
  const [price, setPrice] = useState('');
  const [save, setSave] = useState('');
  const [badge, setBadge] = useState('');
  const [icon, setIcon] = useState('FaStar');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [orderIndex, setOrderIndex] = useState<number>(0);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchOffers = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/offers`);
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      toast.error('Failed to load offers from server.');
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(previewUrl);
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
    setTitle('');
    setOrig('');
    setPrice('');
    setSave('');
    setBadge('');
    setIcon('FaStar');
    setImageFile(null);
    setImagePreview(null);
    setOrderIndex(offers.length > 0 ? Math.max(...offers.map(s => s.order)) + 1 : 0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (offer: Offer) => {
    setEditingId(offer._id);
    setTitle(offer.title);
    setOrig(offer.orig);
    setPrice(offer.price);
    setSave(offer.save);
    setBadge(offer.badge);
    setIcon(offer.icon);
    setImagePreview(offer.image);
    setOrderIndex(offer.order);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error('Please select an image for the offer.');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading(editingId ? 'Updating offer...' : 'Creating offer...');

    try {
      let finalImageUrl = imagePreview; 

      if (imageFile) finalImageUrl = await uploadToImgBB(imageFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const url = editingId ? `${apiUrl}/api/offers/${editingId}` : `${apiUrl}/api/offers`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, orig, price, save, badge, icon, image: finalImageUrl, order: orderIndex 
        }),
      });

      if (res.ok) {
        toast.success(editingId ? 'Offer updated successfully!' : 'Offer published successfully!', { id: loadingToast });
        resetForm();
        fetchOffers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to save offer to database.', { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: loadingToast, duration: 5000 });
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setOfferToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!offerToDelete) return;
    setDeleteModalOpen(false);
    const loadingToast = toast.loading('Deleting offer...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/offers/${offerToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Offer deleted.', { id: loadingToast });
        if (editingId === offerToDelete) resetForm();
        fetchOffers();
      } else {
        toast.error('Failed to delete offer.', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Server error deleting offer.', { id: loadingToast });
    } finally {
      setOfferToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Special Offers Manager</h2>
          <p className="text-gray-500 mt-1">Manage the beautiful offer cards shown on the homepage.</p>
        </div>
      </div>

      {/* Upload / Edit Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            {editingId ? <FiEdit2 className="text-rose-500" /> : <FiPlus className="text-rose-500" />} 
            {editingId ? 'Edit Offer' : 'Add New Offer'}
          </h3>
          {editingId && (
            <button onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
              <FiX /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-1 space-y-3">
              <label className="block text-sm font-semibold text-slate-700">Offer Background Image</label>
              <div className="relative group border-2 border-dashed border-slate-200 rounded-xl hover:border-rose-300 transition-colors bg-slate-50 overflow-hidden h-48">
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full flex flex-col items-center justify-center p-4">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <FiImage className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p className="text-sm">Click or drag image here</p>
                      <p className="text-xs mt-1 text-slate-300">Square or Portrait recommended</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title (e.g., Eyebrow Threading)</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Badge Text (e.g., Most Popular)</label>
                <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Original Price (e.g., $10)</label>
                <input type="text" value={orig} onChange={(e) => setOrig(e.target.value)} required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Discounted Price (e.g., $7)</label>
                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Savings Text (e.g., 30% or $3)</label>
                <input type="text" value={save} onChange={(e) => setSave(e.target.value)} required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Badge Icon</label>
                <select value={icon} onChange={(e) => setIcon(e.target.value)} required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none bg-white">
                  <option value="FaStar">⭐ Star</option>
                  <option value="FaTag">🏷️ Tag</option>
                  <option value="FaGift">🎁 Gift</option>
                  <option value="FaBolt">⚡ Bolt</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-6 border-t border-slate-100 pt-6">
            <div className="w-full sm:w-48">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Display Order</label>
              <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} min="0"
                className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>
            
            <div className="w-full sm:w-auto sm:ml-auto">
              <button type="submit" disabled={uploading}
                className={`w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-md transition-all ${uploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-rose-500 hover:-translate-y-0.5'}`}>
                {uploading ? 'Processing...' : editingId ? 'Save Changes' : 'Publish Offer'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Offers Gallery */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Published Offers <span className="bg-slate-100 text-slate-500 text-sm py-0.5 px-2.5 rounded-full">{offers.length}</span>
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FiImage className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No offers published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className={`group bg-white border ${editingId === offer._id ? 'border-rose-400 shadow-md' : 'border-slate-100 shadow-sm'} rounded-2xl overflow-hidden`}>
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover opacity-60" />
                  <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-bold border border-white/30">
                    {offer.badge}
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white font-bold truncate">{offer.title}</p>
                    <p className="text-white/80 text-sm line-through inline mr-2">{offer.orig}</p>
                    <p className="text-rose-300 font-bold inline">{offer.price}</p>
                  </div>
                </div>

                <div className="p-3 bg-white flex justify-between items-center border-t border-slate-50">
                  <span className="text-xs font-medium text-slate-400">Order: {offer.order}</span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(offer)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => confirmDelete(offer._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Delete Offer?</h3>
            <p className="text-center text-slate-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200">Cancel</button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
