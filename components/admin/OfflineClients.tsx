'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaPhone, FaCalendarAlt, FaSpa, FaClock, FaTrash, FaPlus, FaEdit, FaTimes, FaVenusMars, FaSave } from 'react-icons/fa';

export interface OfflineClient {
  id: string;
  name: string;
  mobile: string;
  visitDate: string;
  service: string;
  notes: string;
  revisitPeriod: string; // e.g. "4 weeks", "1 month"
  revisitDate: string;   // calculated or manually set
  periodDate: string;    // menstrual cycle date
  createdAt: string;
}

function getClients(): OfflineClient[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('blossom_offline_clients') || '[]'); } catch { return []; }
}
function saveClients(items: OfflineClient[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('blossom_offline_clients', JSON.stringify(items));
  }
}

function addDaysToDate(dateStr: string, weeks: string): string {
  if (!dateStr || !weeks) return '';
  const match = weeks.match(/(\d+)/);
  if (!match) return '';
  const num = parseInt(match[1]);
  const isMonth = /month/i.test(weeks);
  const d = new Date(dateStr);
  if (isMonth) d.setMonth(d.getMonth() + num);
  else d.setDate(d.getDate() + num * 7);
  return d.toISOString().split('T')[0];
}

const SERVICE_OPTS = [
  'Eyebrow Threading', 'Upper Lip Threading', 'Full Face Threading', 'Underarms Wax',
  'Full Legs Wax', 'Brazilian Wax', 'Signature Facial', 'Fruit Facial', 'D-Tan Facial',
  'Acne Facial', 'Hair Cut', 'Hair Color', 'Root Touch Up', 'Hair Spa',
  'Bridal Makeup', 'Party Makeup', 'Eyebrow Tint', 'Lash Tint', 'Other',
];

const emptyForm: Omit<OfflineClient, 'id' | 'createdAt'> = {
  name: '', mobile: '', visitDate: '', service: '', notes: '',
  revisitPeriod: '', revisitDate: '', periodDate: '',
};

export default function OfflineClients() {
  const [clients, setClients] = useState<OfflineClient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const setF = (k: keyof typeof emptyForm, v: string) => {
    const updated = { ...form, [k]: v };
    if ((k === 'revisitPeriod' || k === 'visitDate') && updated.visitDate && updated.revisitPeriod) {
      updated.revisitDate = addDaysToDate(updated.visitDate, updated.revisitPeriod);
    }
    setForm(updated);
  };

  const saveClient = () => {
    if (!form.name.trim() || !form.mobile.trim() || !form.visitDate) {
      showToast('❌ Name, Mobile & Visit Date are required'); return;
    }
    if (editId) {
      const updated = clients.map(c => c.id === editId ? { ...c, ...form } : c);
      saveClients(updated); setClients(updated);
      showToast('✅ Client updated!');
    } else {
      const newClient: OfflineClient = { ...form, id: Date.now().toString(), createdAt: new Date().toISOString() };
      const updated = [newClient, ...clients];
      saveClients(updated); setClients(updated);
      showToast('✅ Client added!');
    }
    setForm({ ...emptyForm }); setEditId(null); setShowForm(false);
  };

  const editClient = (c: OfflineClient) => {
    setForm({ name: c.name, mobile: c.mobile, visitDate: c.visitDate, service: c.service,
      notes: c.notes, revisitPeriod: c.revisitPeriod, revisitDate: c.revisitDate, periodDate: c.periodDate });
    setEditId(c.id); setShowForm(true);
  };

  const deleteClient = (id: string) => {
    const updated = clients.filter(c => c.id !== id);
    saveClients(updated); setClients(updated); showToast('🗑️ Client removed');
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-[999] glass-strong rounded-xl px-4 py-2.5 shadow-lg text-sm font-medium text-dark border border-accent/20">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-dark">Walk-in Client Records</h3>
          <p className="text-[9px] sm:text-[10px] text-dark/35">{clients.length} clients on record</p>
        </div>
        <button onClick={() => { setForm({ ...emptyForm }); setEditId(null); setShowForm(!showForm); }}
          className="btn-glow flex items-center gap-1.5 bg-gradient-to-r from-rose to-rose-dark text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs font-semibold shadow-md shadow-rose/15">
          <FaPlus className="text-[8px]" /> Add Client
        </button>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="glass-strong rounded-2xl p-4 sm:p-5 space-y-3 border border-accent/20">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-serif text-sm font-bold text-dark">{editId ? '✏️ Edit Client' : '➕ Add Walk-in Client'}</h4>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 rounded-full bg-dark/5 flex items-center justify-center text-dark/40 hover:text-dark/70">
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-1 text-[8px] font-semibold text-dark/40 uppercase tracking-wider mb-1">
                    <FaUser className="text-[7px]" /> Name *
                  </label>
                  <input value={form.name} onChange={e => setF('name', e.target.value)} placeholder="Client name"
                    className="w-full px-3 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70 placeholder:text-dark/20" />
                </div>
                {/* Mobile */}
                <div>
                  <label className="flex items-center gap-1 text-[8px] font-semibold text-dark/40 uppercase tracking-wider mb-1">
                    <FaPhone className="text-[7px]" /> Mobile *
                  </label>
                  <input value={form.mobile} onChange={e => setF('mobile', e.target.value)} placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70 placeholder:text-dark/20" />
                </div>
                {/* Visit Date */}
                <div>
                  <label className="flex items-center gap-1 text-[8px] font-semibold text-dark/40 uppercase tracking-wider mb-1">
                    <FaCalendarAlt className="text-[7px]" /> Visit Date *
                  </label>
                  <input type="date" value={form.visitDate} onChange={e => setF('visitDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70" />
                </div>
                {/* Service */}
                <div>
                  <label className="flex items-center gap-1 text-[8px] font-semibold text-dark/40 uppercase tracking-wider mb-1">
                    <FaSpa className="text-[7px]" /> Service
                  </label>
                  <select value={form.service} onChange={e => setF('service', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70">
                    <option value="">Select service</option>
                    {SERVICE_OPTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Revisit Period */}
              <div className="rounded-xl bg-blush/20 border border-accent/20 p-3 space-y-2">
                <p className="text-[9px] font-bold text-dark/60 uppercase tracking-wider flex items-center gap-1.5">
                  <FaClock className="text-accent text-[8px]" /> ⏰ Revisit Reminder Setup
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[8px] text-dark/40 font-medium mb-1 block">Estimated Revisit Period</label>
                    <input value={form.revisitPeriod} onChange={e => setF('revisitPeriod', e.target.value)}
                      placeholder="e.g. 4 weeks / 1 month"
                      className="w-full px-2.5 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70 placeholder:text-dark/20" />
                    <p className="text-[7px] text-dark/30 mt-0.5">Type time e.g. "3 weeks", "2 months"</p>
                  </div>
                  <div>
                    <label className="text-[8px] text-dark/40 font-medium mb-1 block">Revisit Reminder Date</label>
                    <input type="date" value={form.revisitDate} onChange={e => setF('revisitDate', e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70" />
                    <p className="text-[7px] text-dark/30 mt-0.5">Auto-filled when period is set</p>
                  </div>
                </div>
              </div>

              {/* Period tracker */}
              <div className="rounded-xl bg-lavender/15 border border-lavender/25 p-3">
                <p className="text-[9px] font-bold text-dark/60 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <FaVenusMars className="text-lavender text-[8px]" /> 🌸 Period Tracker (Optional)
                </p>
                <div>
                  <label className="text-[8px] text-dark/40 font-medium mb-1 block">Expected Period / Next Cycle Date</label>
                  <input type="date" value={form.periodDate} onChange={e => setF('periodDate', e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-lavender/25 bg-white/60 focus:border-lavender outline-none text-xs text-dark/70" />
                  <p className="text-[7px] text-dark/30 mt-0.5">We'll remind you 5 days before to reach out with care</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[8px] font-semibold text-dark/40 uppercase tracking-wider mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={e => setF('notes', e.target.value)} rows={2}
                  placeholder="Any additional notes about this client..."
                  className="w-full px-3 py-2 rounded-lg border border-accent/20 bg-white/60 focus:border-rose outline-none text-xs text-dark/70 placeholder:text-dark/20 resize-none" />
              </div>

              <div className="flex gap-2">
                <button onClick={saveClient}
                  className="flex-1 bg-gradient-to-r from-rose to-rose-dark text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose/15">
                  <FaSave className="text-[9px]" /> {editId ? 'Update Client' : 'Save Client'}
                </button>
                <button onClick={() => { setShowForm(false); setForm({ ...emptyForm }); setEditId(null); }}
                  className="px-4 py-2.5 rounded-xl border border-accent/20 text-dark/50 text-xs font-medium hover:bg-dark/5 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, mobile, service..."
        className="w-full px-4 py-2.5 rounded-xl border border-accent/20 bg-white/50 focus:border-rose outline-none text-sm text-dark/70 placeholder:text-dark/25" />

      {/* Client list */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="text-center py-10 glass-strong rounded-2xl text-dark/30">
            <FaUser className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="text-sm">No clients found</p>
            <p className="text-xs mt-1">Add walk-in clients to track their visits</p>
          </div>
        ) : (
          filtered.map((c, i) => {
            const today = new Date();
            const revisit = c.revisitDate ? new Date(c.revisitDate) : null;
            const period = c.periodDate ? new Date(c.periodDate) : null;
            const revisitDaysLeft = revisit ? Math.ceil((revisit.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
            const periodDaysLeft = period ? Math.ceil((period.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
            const revisitDue = revisitDaysLeft !== null && revisitDaysLeft <= 7 && revisitDaysLeft >= 0;
            const revisitOverdue = revisitDaysLeft !== null && revisitDaysLeft < 0;
            const periodSoon = periodDaysLeft !== null && periodDaysLeft <= 5 && periodDaysLeft >= 0;

            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-xl border bg-white/50 p-3 sm:p-4 ${
                  revisitOverdue ? 'border-red-200 bg-red-50/30' :
                  revisitDue ? 'border-gold/30 bg-gold/5' :
                  periodSoon ? 'border-lavender/40 bg-lavender/5' :
                  'border-accent/15'
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-serif font-bold text-dark text-sm sm:text-base">{c.name}</p>
                      {revisitOverdue && <span className="text-[7px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded-full border border-red-200">⚠️ OVERDUE</span>}
                      {revisitDue && !revisitOverdue && <span className="text-[7px] font-bold bg-gold/15 text-gold px-1.5 py-0.5 rounded-full border border-gold/20">⏰ REVISIT DUE</span>}
                      {periodSoon && <span className="text-[7px] font-bold bg-lavender/20 text-lavender px-1.5 py-0.5 rounded-full border border-lavender/30">🌸 PERIOD SOON</span>}
                    </div>
                    <a href={`tel:${c.mobile}`} className="flex items-center gap-1 text-[10px] text-rose hover:text-rose-dark font-medium mt-0.5">
                      <FaPhone className="text-[8px]" /> {c.mobile}
                    </a>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => editClient(c)} className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent/20">
                      <FaEdit className="text-[9px]" />
                    </button>
                    <button onClick={() => deleteClient(c.id)} className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100">
                      <FaTrash className="text-[9px]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-2.5">
                  <div className="glass rounded-lg px-2 py-1">
                    <p className="text-[6px] text-dark/30 uppercase font-semibold">Last Visit</p>
                    <p className="text-[9px] font-medium text-dark/60">{c.visitDate}</p>
                  </div>
                  <div className="glass rounded-lg px-2 py-1">
                    <p className="text-[6px] text-dark/30 uppercase font-semibold">Service</p>
                    <p className="text-[9px] font-medium text-dark/60 truncate">{c.service || '—'}</p>
                  </div>
                  {c.revisitPeriod && (
                    <div className={`rounded-lg px-2 py-1 ${revisitDue || revisitOverdue ? 'bg-gold/10 border border-gold/20' : 'glass'}`}>
                      <p className="text-[6px] text-dark/30 uppercase font-semibold">Revisit In</p>
                      <p className="text-[9px] font-medium text-dark/60">{c.revisitPeriod}</p>
                      {revisitDaysLeft !== null && (
                        <p className={`text-[7px] font-bold ${revisitOverdue ? 'text-red-500' : revisitDue ? 'text-gold' : 'text-emerald'}`}>
                          {revisitOverdue ? `${Math.abs(revisitDaysLeft)}d overdue` : `${revisitDaysLeft}d left`}
                        </p>
                      )}
                    </div>
                  )}
                  {c.periodDate && (
                    <div className={`rounded-lg px-2 py-1 ${periodSoon ? 'bg-lavender/15 border border-lavender/25' : 'glass'}`}>
                      <p className="text-[6px] text-dark/30 uppercase font-semibold">Period Date</p>
                      <p className="text-[9px] font-medium text-dark/60">{c.periodDate}</p>
                      {periodDaysLeft !== null && (
                        <p className={`text-[7px] font-bold ${periodSoon ? 'text-lavender' : 'text-dark/30'}`}>
                          {periodSoon ? `In ${periodDaysLeft}d — reach out!` : `In ${periodDaysLeft}d`}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {c.notes && (
                  <p className="text-[9px] text-dark/55 italic mt-2 pl-1 border-l-2 border-accent/20">{c.notes}</p>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
