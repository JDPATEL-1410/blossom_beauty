import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaCheckCircle, FaHourglass, FaTrash, FaEnvelope, FaStickyNote } from 'react-icons/fa';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'done';
  createdAt: string;
}

function getAppointments(): Appointment[] {
  try { return JSON.parse(localStorage.getItem('blossom_appointments') || '[]'); } catch { return []; }
}
function saveAppointments(items: Appointment[]) {
  localStorage.setItem('blossom_appointments', JSON.stringify(items));
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-gold/15 text-gold border border-gold/20',
  confirmed: 'bg-emerald/15 text-emerald border border-emerald/20',
  done: 'bg-dark/10 text-dark/40 border border-dark/10',
};
const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: FaHourglass,
  confirmed: FaCheckCircle,
  done: FaCheckCircle,
};

export default function AppointmentManager() {
  const [appts, setAppts] = useState<Appointment[]>(getAppointments());
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'done'>('all');

  const updateStatus = (id: string, status: Appointment['status']) => {
    const updated = appts.map(a => a.id === id ? { ...a, status } : a);
    saveAppointments(updated);
    setAppts(updated);
  };

  const deleteAppt = (id: string) => {
    const updated = appts.filter(a => a.id !== id);
    saveAppointments(updated);
    setAppts(updated);
  };

  const filtered = filter === 'all' ? appts : appts.filter(a => a.status === filter);
  const counts = {
    all: appts.length,
    pending: appts.filter(a => a.status === 'pending').length,
    confirmed: appts.filter(a => a.status === 'confirmed').length,
    done: appts.filter(a => a.status === 'done').length,
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {(['all', 'pending', 'confirmed', 'done'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-xl p-2.5 sm:p-3.5 text-center transition-all duration-300 ${
              filter === s
                ? 'bg-gradient-to-br from-rose to-rose-dark text-white shadow-md shadow-rose/20'
                : 'glass-strong text-dark/60 hover:shadow-md'
            }`}>
            <p className="font-serif font-bold text-lg sm:text-2xl">{counts[s]}</p>
            <p className="text-[8px] sm:text-[10px] font-medium capitalize">{s}</p>
          </button>
        ))}
      </div>

      {/* Appointments list */}
      <div className="glass-strong rounded-2xl p-4 sm:p-5">
        <h3 className="font-serif text-base font-bold text-dark mb-3 flex items-center gap-2">
          <FaCalendarAlt className="text-rose text-sm" />
          {filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
          <span className="ml-auto text-[10px] text-dark/30 font-sans font-normal">{filtered.length} records</span>
        </h3>

        {filtered.length === 0 ? (
          <div className="text-center py-10 text-dark/30">
            <FaCalendarAlt className="text-4xl mx-auto mb-2 opacity-20" />
            <p className="text-sm">No appointments found</p>
            <p className="text-xs mt-1">Appointments from the booking form will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((appt, i) => {
              const SIcon = STATUS_ICONS[appt.status];
              return (
                <motion.div key={appt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border border-accent/15 rounded-xl p-3 sm:p-4 bg-white/40 hover:bg-white/70 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <FaUser className="text-accent text-[10px]" />
                        <p className="font-serif font-bold text-dark text-sm sm:text-base">{appt.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="flex items-center gap-1 text-[10px] text-dark/45">
                          <FaPhone className="text-[8px] text-accent" /> {appt.phone}
                        </span>
                        {appt.email && (
                          <span className="flex items-center gap-1 text-[10px] text-dark/45">
                            <FaEnvelope className="text-[8px] text-accent" /> {appt.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`inline-flex items-center gap-1 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[appt.status]}`}>
                        <SIcon className="text-[7px]" /> {appt.status}
                      </span>
                      <button onClick={() => deleteAppt(appt.id)}
                        className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <FaTrash className="text-[9px]" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                    <div className="glass rounded-lg px-2 py-1.5">
                      <p className="text-[7px] text-dark/30 uppercase font-semibold">Service</p>
                      <p className="text-[10px] sm:text-[11px] font-medium text-dark/70 leading-tight">{appt.service}</p>
                    </div>
                    <div className="glass rounded-lg px-2 py-1.5">
                      <p className="text-[7px] text-dark/30 uppercase font-semibold">Date</p>
                      <p className="text-[10px] sm:text-[11px] font-medium text-dark/70 flex items-center gap-1">
                        <FaCalendarAlt className="text-[7px] text-accent" /> {appt.date}
                      </p>
                    </div>
                    <div className="glass rounded-lg px-2 py-1.5">
                      <p className="text-[7px] text-dark/30 uppercase font-semibold">Time</p>
                      <p className="text-[10px] sm:text-[11px] font-medium text-dark/70 flex items-center gap-1">
                        <FaClock className="text-[7px] text-accent" /> {appt.time}
                      </p>
                    </div>
                  </div>

                  {appt.notes && (
                    <div className="glass rounded-lg px-2.5 py-1.5 mb-2 flex items-start gap-1.5">
                      <FaStickyNote className="text-accent text-[9px] mt-0.5 flex-shrink-0" />
                      <p className="text-[9px] sm:text-[10px] text-dark/50 italic">{appt.notes}</p>
                    </div>
                  )}

                  {/* Status actions */}
                  <div className="flex gap-1.5 flex-wrap">
                    {appt.status === 'pending' && (
                      <button onClick={() => updateStatus(appt.id, 'confirmed')}
                        className="text-[9px] font-semibold text-emerald bg-emerald/10 px-3 py-1 rounded-full border border-emerald/20 hover:bg-emerald/20 transition-colors">
                        ✓ Confirm
                      </button>
                    )}
                    {appt.status !== 'done' && (
                      <button onClick={() => updateStatus(appt.id, 'done')}
                        className="text-[9px] font-semibold text-dark/40 bg-dark/5 px-3 py-1 rounded-full border border-dark/10 hover:bg-dark/10 transition-colors">
                        Mark Done
                      </button>
                    )}
                    {appt.status !== 'pending' && (
                      <button onClick={() => updateStatus(appt.id, 'pending')}
                        className="text-[9px] font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20 hover:bg-gold/20 transition-colors">
                        Reset to Pending
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
