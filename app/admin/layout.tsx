'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiLogOut, FiHome, FiSettings, FiUsers } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Basic check for token in localStorage
    const token = localStorage.getItem('adminToken');
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (token) {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-slate-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiHome /> Dashboard
          </Link>
          <Link href="/admin/hero" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiHome /> Hero Section
          </Link>
          <Link href="/admin/offers" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiHome /> Special Offers
          </Link>
          <Link href="/admin/appointments" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiHome /> Appointments
          </Link>
          <Link href="/admin/gallery" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiHome /> Beauty Gallery
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiUsers /> Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded hover:bg-slate-800 transition-colors">
            <FiSettings /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 text-left text-red-400 hover:bg-slate-800 rounded transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-slate-800">Blossom Beauty Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Admin User</span>
          </div>
        </header>
        <div className="p-8">
          <Toaster position="top-right" />
          {children}
        </div>
      </main>
    </div>
  );
}
