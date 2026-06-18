'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface GalleryImage {
  _id: string;
  src: string;
  alt: string;
  cat: string;
  order: number;
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alt, setAlt] = useState('');
  const [cat, setCat] = useState('');
  const [orderIndex, setOrderIndex] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/gallery`);
      const data = await res.json();
      setImages(data);
    } catch (error) {
      toast.error('Failed to load gallery images from server.');
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
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
    setAlt('');
    setCat('');
    setImageFile(null);
    setImagePreview(null);
    setOrderIndex(images.length > 0 ? Math.max(...images.map(s => s.order || 0)) + 1 : 0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (image: GalleryImage) => {
    setEditingId(image._id);
    setAlt(image.alt);
    setCat(image.cat);
    setOrderIndex(image.order);
    setImagePreview(image.src);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId && !imageFile) {
      toast.error('Please select an image to upload.');
      return;
    }

    setUploading(true);
    const loadingToast = toast.loading(editingId ? 'Updating image...' : 'Publishing image...');

    try {
      let finalImageUrl = imagePreview; 

      if (imageFile) finalImageUrl = await uploadToImgBB(imageFile);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const url = editingId ? `${apiUrl}/api/gallery/${editingId}` : `${apiUrl}/api/gallery`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          src: finalImageUrl, alt, cat, order: orderIndex 
        }),
      });

      if (res.ok) {
        toast.success(editingId ? 'Image updated successfully!' : 'Image published successfully!', { id: loadingToast });
        resetForm();
        fetchImages();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to save image to database.', { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: loadingToast, duration: 5000 });
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setImageToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!imageToDelete) return;
    setDeleteModalOpen(false);
    const loadingToast = toast.loading('Deleting image...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/gallery/${imageToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Image deleted.', { id: loadingToast });
        if (editingId === imageToDelete) resetForm();
        fetchImages();
      } else {
        toast.error('Failed to delete image.', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Server error deleting image.', { id: loadingToast });
    } finally {
      setImageToDelete(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Gallery Manager</h2>
          <p className="text-gray-500 mt-1">Upload and manage images for the public Beauty Gallery.</p>
        </div>
      </div>

      {/* Upload / Edit Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lavender-light/30 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
        
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-800">
            {editingId ? <FiEdit2 className="text-lavender-dark" /> : <FiPlus className="text-lavender-dark" />} 
            {editingId ? 'Edit Image' : 'Add New Image'}
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
              <label className="block text-sm font-semibold text-slate-700">Photo</label>
              <div className="relative group border-2 border-dashed border-slate-200 rounded-xl hover:border-lavender-dark/50 transition-colors bg-slate-50 overflow-hidden h-48">
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
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description (Alt Text)</label>
                <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} required placeholder="e.g., Bridal Makeup Session"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-lavender-dark outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category</label>
                <input type="text" value={cat} onChange={(e) => setCat(e.target.value)} required placeholder="e.g., Hair, Facials, Threading"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-lavender-dark outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                <input type="number" value={orderIndex} onChange={(e) => setOrderIndex(Number(e.target.value))} min="0"
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-lavender-dark outline-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-end gap-6 border-t border-slate-100 pt-6">
            <div className="w-full sm:w-auto sm:ml-auto">
              <button type="submit" disabled={uploading}
                className={`w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg font-medium shadow-md transition-all ${uploading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-lavender-dark hover:-translate-y-0.5'}`}>
                {uploading ? 'Processing...' : editingId ? 'Save Changes' : 'Publish Image'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Published Images <span className="bg-slate-100 text-slate-500 text-sm py-0.5 px-2.5 rounded-full">{images.length}</span>
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>)}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FiImage className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">No images published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image._id} className={`group bg-white border ${editingId === image._id ? 'border-lavender-dark shadow-md' : 'border-slate-100 shadow-sm'} rounded-xl overflow-hidden`}>
                <div className="relative h-40 bg-slate-900 overflow-hidden">
                  <img src={image.src.startsWith('/') ? image.src : image.src} alt={image.alt} className="w-full h-full object-cover opacity-80" />
                  <div className="absolute top-2 left-2 bg-white/30 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold border border-white/30 shadow-sm">
                    {image.cat}
                  </div>
                </div>

                <div className="p-3 bg-white flex flex-col gap-2 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-700 truncate" title={image.alt}>{image.alt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-slate-400">Order: {image.order}</span>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(image)} className="p-1.5 text-slate-400 hover:text-lavender-dark hover:bg-lavender-light/20 rounded-md transition-colors">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => confirmDelete(image._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
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
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Delete Image?</h3>
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
