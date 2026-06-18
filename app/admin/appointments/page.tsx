'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiPhone, FiMail, FiTrash2, FiAlertCircle, FiCheck, FiX, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');

  // Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (error) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Status updated to ${newStatus}`);
        fetchAppointments();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Server error');
    }
  };

  const confirmDelete = (id: string) => {
    setAppointmentToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!appointmentToDelete) return;
    setDeleteModalOpen(false);
    const loadingToast = toast.loading('Deleting appointment...');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${apiUrl}/api/appointments/${appointmentToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success('Appointment deleted.', { id: loadingToast });
        fetchAppointments();
      } else {
        toast.error('Failed to delete appointment.', { id: loadingToast });
      }
    } catch (error) {
      toast.error('Server error.', { id: loadingToast });
    } finally {
      setAppointmentToDelete(null);
    }
  };

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: 'numeric', minute: '2-digit', hour12: true 
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const formatDate = (dateString: string) => {
     if(!dateString.includes('T')) {
         const parts = dateString.split('-');
         if(parts.length === 3) {
             const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
             return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
         }
     }
     return new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
      if(!timeString) return '';
      const [hours, minutes] = timeString.split(':');
      let h = parseInt(hours);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12; 
      return `${h}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get unique services for filter dropdown
  const uniqueServices = Array.from(new Set(appointments.map(a => a.service)));

  // Filtered Appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchDate = filterDate ? appt.date === filterDate : true;
    const matchStatus = filterStatus !== 'all' ? appt.status === filterStatus : true;
    const matchService = filterService !== 'all' ? appt.service === filterService : true;
    return matchDate && matchStatus && matchService;
  });

  const clearFilters = () => {
    setFilterDate('');
    setFilterStatus('all');
    setFilterService('all');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Appointments</h2>
          <p className="text-gray-500 mt-1">Manage customer booking requests securely.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
           <span className="font-bold text-slate-800">{filteredAppointments.length}</span> / {appointments.length}
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-wrap items-end gap-4">
        <div className="flex items-center gap-2 text-slate-500 font-semibold mb-1 w-full sm:w-auto">
          <FiFilter /> Filters:
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Date</label>
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Service</label>
          <select 
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="w-full sm:w-auto border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-rose-500 outline-none bg-white"
          >
            <option value="all">All Services</option>
            {uniqueServices.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {(filterDate || filterStatus !== 'all' || filterService !== 'all') && (
          <button 
            onClick={clearFilters}
            className="text-sm font-medium text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 mb-2 ml-auto sm:ml-2"
          >
            <FiX /> Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-xl shadow-sm border border-slate-100 animate-pulse"></div>)}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <FiCalendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium">No appointments received yet.</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <FiFilter className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-medium mb-2">No appointments match your filters.</p>
          <button onClick={clearFilters} className="text-rose-500 hover:underline text-sm font-semibold">Clear Filters</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 font-semibold text-slate-600 text-sm">Client Info</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Service Requested</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Requested Date & Time</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Submitted At</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map(appt => (
                  <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-800">{appt.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                        <FiPhone className="text-slate-400" size={12} /> {appt.phone}
                      </div>
                      {appt.email && (
                         <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                           <FiMail className="text-slate-400" size={12} /> {appt.email}
                         </div>
                      )}
                      {appt.notes && (
                        <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded border border-amber-100">
                          <strong>Note:</strong> {appt.notes}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                        {appt.service}
                      </span>
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                         <FiCalendar className="text-slate-400" /> {formatDate(appt.date)}
                      </div>
                      <div className="text-slate-500 flex items-center gap-1.5 mt-1 text-sm">
                         <FiClock className="text-slate-400" /> {formatTime(appt.time)}
                      </div>
                    </td>
                    <td className="p-4 align-top">
                       <div className="text-sm text-slate-500">
                         {formatDateTime(appt.createdAt)}
                       </div>
                    </td>
                    <td className="p-4 align-top">
                      <select 
                         value={appt.status}
                         onChange={(e) => updateStatus(appt._id, e.target.value)}
                         className={`text-sm font-semibold px-3 py-1.5 rounded-lg border outline-none appearance-none cursor-pointer ${getStatusColor(appt.status)}`}
                      >
                         <option value="pending">Pending</option>
                         <option value="confirmed">Confirmed</option>
                         <option value="completed">Completed</option>
                         <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 align-top text-right">
                       <button onClick={() => confirmDelete(appt._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                         <FiTrash2 size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Delete Appointment?</h3>
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
