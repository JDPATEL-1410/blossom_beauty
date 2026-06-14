'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaClock, FaUser, FaPhone, FaCalendarAlt, FaVenusMars, FaExclamationTriangle, FaCheckCircle, FaSpa } from 'react-icons/fa';
import type { OfflineClient } from './OfflineClients';

function getClients(): OfflineClient[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('blossom_offline_clients') || '[]'); } catch { return []; }
}
function getAppointments() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('blossom_appointments') || '[]'); } catch { return []; }
}

interface Reminder {
  id: string;
  type: 'revisit' | 'period' | 'appointment';
  clientName: string;
  mobile: string;
  service: string;
  dueDate: string;
  daysLeft: number;
  urgency: 'overdue' | 'today' | 'soon' | 'upcoming';
  note?: string;
}

function daysFromNow(dateStr: string): number {
  if (!dateStr) return 9999;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function urgency(days: number): Reminder['urgency'] {
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 5) return 'soon';
  return 'upcoming';
}

const URGENCY_STYLES: Record<string, string> = {
  overdue: 'border-red-300 bg-red-50/60',
  today: 'border-rose/40 bg-blush/30',
  soon: 'border-gold/30 bg-gold/5',
  upcoming: 'border-accent/15 bg-white/40',
};
const URGENCY_BADGE: Record<string, string> = {
  overdue: 'bg-red-100 text-red-600 border-red-200',
  today: 'bg-rose/15 text-rose border-rose/20',
  soon: 'bg-gold/15 text-gold border-gold/20',
  upcoming: 'bg-accent/10 text-accent border-accent/20',
};

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState<'all' | 'revisit' | 'period' | 'appointment'>('all');

  useEffect(() => {
    const clients: OfflineClient[] = getClients();
    const appointments = getAppointments();
    const all: Reminder[] = [];

    // Revisit reminders
    clients.forEach(c => {
      if (c.revisitDate) {
        const days = daysFromNow(c.revisitDate);
        if (days <= 30) {
          all.push({
            id: `revisit-${c.id}`,
            type: 'revisit',
            clientName: c.name,
            mobile: c.mobile,
            service: c.service || 'Beauty Service',
            dueDate: c.revisitDate,
            daysLeft: days,
            urgency: urgency(days),
            note: c.notes,
          });
        }
      }
    });

    // Period reminders (within 7 days)
    clients.forEach(c => {
      if (c.periodDate) {
        const days = daysFromNow(c.periodDate);
        if (days >= -2 && days <= 7) {
          all.push({
            id: `period-${c.id}`,
            type: 'period',
            clientName: c.name,
            mobile: c.mobile,
            service: '🌸 Period Reminder',
            dueDate: c.periodDate,
            daysLeft: days,
            urgency: days <= 0 ? 'overdue' : days <= 2 ? 'today' : 'soon',
            note: 'Reach out with care during this time',
          });
        }
      }
    });

    // Upcoming appointments (next 7 days)
    appointments.forEach((a: any) => {
      if (a.date && a.status !== 'done') {
        const days = daysFromNow(a.date);
        if (days >= 0 && days <= 7) {
          all.push({
            id: `appt-${a.id}`,
            type: 'appointment',
            clientName: a.name,
            mobile: a.phone,
            service: a.service,
            dueDate: `${a.date} at ${a.time}`,
            daysLeft: days,
            urgency: urgency(days),
            note: a.notes,
          });
        }
      }
    });

    // Sort: overdue first, then by days
    all.sort((a, b) => {
      const order = { overdue: 0, today: 1, soon: 2, upcoming: 3 };
      if (order[a.urgency] !== order[b.urgency]) return order[a.urgency] - order[b.urgency];
      return a.daysLeft - b.daysLeft;
    });

    setReminders(all);
  }, []);

  const filtered = filter === 'all' ? reminders : reminders.filter(r => r.type === filter);

  const counts = {
    all: reminders.length,
    revisit: reminders.filter(r => r.type === 'revisit').length,
    period: reminders.filter(r => r.type === 'period').length,
    appointment: reminders.filter(r => r.type === 'appointment').length,
  };

  const typeIcon = (type: string) => {
    if (type === 'revisit') return FaClock;
    if (type === 'period') return FaVenusMars;
    return FaCalendarAlt;
  };

  const typeColor = (type: string) => {
    if (type === 'revisit') return 'text-accent';
    if (type === 'period') return 'text-lavender';
    return 'text-rose';
  };

  const typeLabel = (type: string) => {
    if (type === 'revisit') return '⏰ Revisit';
    if (type === 'period') return '🌸 Period';
    return '📅 Appointment';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-strong rounded-2xl p-4 sm:p-5 border border-accent/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center shadow-md">
            <FaBell className="text-white text-sm" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-dark">Reminder Dashboard</h3>
            <p className="text-[9px] text-dark/40">{reminders.filter(r => r.urgency === 'overdue' || r.urgency === 'today' || r.urgency === 'soon').length} urgent reminders</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {(['all', 'revisit', 'period', 'appointment'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-xl py-2 text-center transition-all duration-200 ${
                filter === f ? 'bg-gradient-to-br from-rose to-rose-dark text-white shadow-sm' : 'glass text-dark/50 hover:glass-strong'
              }`}>
              <p className="font-serif font-bold text-sm sm:text-base">{counts[f]}</p>
              <p className="text-[7px] sm:text-[8px] capitalize">{f === 'all' ? 'Total' : f}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Reminders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 glass-strong rounded-2xl text-dark/30">
          <FaCheckCircle className="text-5xl mx-auto mb-3 text-emerald opacity-40" />
          <p className="font-serif text-base font-bold text-dark/50 mb-1">All Clear! 🎉</p>
          <p className="text-xs">No pending reminders for the selected category</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((r, i) => {
            const RIcon = typeIcon(r.type);
            return (
              <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-xl border p-3 sm:p-4 ${URGENCY_STYLES[r.urgency]}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <RIcon className={`text-sm ${typeColor(r.type)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <p className="font-serif font-bold text-dark text-sm">{r.clientName}</p>
                        <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full border ${URGENCY_BADGE[r.urgency]}`}>
                          {r.urgency === 'overdue' ? `⚠️ ${Math.abs(r.daysLeft)}d overdue` :
                           r.urgency === 'today' ? '🔴 TODAY' :
                           r.urgency === 'soon' ? `⏰ ${r.daysLeft}d left` :
                           `📅 in ${r.daysLeft}d`}
                        </span>
                        <span className="text-[7px] text-dark/30 font-medium px-1.5 py-0.5 rounded-full bg-dark/5">
                          {typeLabel(r.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <a href={`tel:${r.mobile}`} className="flex items-center gap-1 text-[10px] text-rose hover:text-rose-dark font-medium">
                          <FaPhone className="text-[8px]" /> {r.mobile}
                        </a>
                        <span className="flex items-center gap-1 text-[10px] text-dark/45">
                          <FaSpa className="text-[8px] text-accent" /> {r.service}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FaCalendarAlt className="text-[7px] text-dark/30" />
                        <span className="text-[9px] text-dark/40">{r.type === 'period' ? 'Period date:' : r.type === 'revisit' ? 'Revisit due:' : 'Appointment:'} <strong>{r.dueDate}</strong></span>
                      </div>
                      {r.note && <p className="text-[8px] text-dark/35 italic mt-0.5 pl-1 border-l-2 border-accent/20">{r.note}</p>}
                    </div>
                  </div>
                  {(r.urgency === 'overdue' || r.urgency === 'today' || r.urgency === 'soon') && (
                    <FaExclamationTriangle className={`text-sm flex-shrink-0 ${r.urgency === 'overdue' ? 'text-red-400' : r.urgency === 'today' ? 'text-rose' : 'text-gold'}`} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {reminders.length === 0 && (
        <div className="glass-strong rounded-2xl p-4 text-center">
          <p className="text-xs text-dark/40">
            💡 Add offline clients with revisit periods and period dates to see reminders here!
          </p>
        </div>
      )}
    </div>
  );
}
