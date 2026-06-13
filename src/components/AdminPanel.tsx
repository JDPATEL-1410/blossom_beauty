import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLock, FaUnlock, FaTimes, FaCamera, FaCalendarAlt, FaUser,
  FaBell, FaSignOutAlt, FaEye, FaEyeSlash, FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import GalleryManager from './admin/GalleryManager';
import AppointmentManager from './admin/AppointmentManager';
import OfflineClients from './admin/OfflineClients';
import Reminders from './admin/Reminders';

const ADMIN_PIN = 'blossom2024';

type Tab = 'reminders' | 'appointments' | 'clients' | 'gallery';

const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'reminders', label: 'Reminders', icon: FaBell },
  { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
  { id: 'clients', label: 'Walk-in Clients', icon: FaUser },
  { id: 'gallery', label: 'Gallery', icon: FaCamera },
];

function getReminderCount(): number {
  try {
    const clients = JSON.parse(localStorage.getItem('blossom_offline_clients') || '[]');
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let count = 0;
    clients.forEach((c: any) => {
      if (c.revisitDate) {
        const d = new Date(c.revisitDate); d.setHours(0, 0, 0, 0);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff <= 7) count++;
      }
      if (c.periodDate) {
        const d = new Date(c.periodDate); d.setHours(0, 0, 0, 0);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= -2 && diff <= 7) count++;
      }
    });
    const appts = JSON.parse(localStorage.getItem('blossom_appointments') || '[]');
    appts.forEach((a: any) => {
      if (a.date && a.status !== 'done') {
        const d = new Date(a.date); d.setHours(0, 0, 0, 0);
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff <= 7) count++;
      }
    });
    return count;
  } catch { return 0; }
}

function getPendingApptCount(): number {
  try {
    const appts = JSON.parse(localStorage.getItem('blossom_appointments') || '[]');
    return appts.filter((a: any) => a.status === 'pending').length;
  } catch { return 0; }
}

interface Props { onClose: () => void; }

export default function AdminPanel({ onClose }: Props) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('blossom_admin') === '1');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('reminders');
  const [reminderCount, setReminderCount] = useState(getReminderCount());
  const [pendingCount, setPendingCount] = useState(getPendingApptCount());

  useEffect(() => {
    const refresh = () => { setReminderCount(getReminderCount()); setPendingCount(getPendingApptCount()); };
    refresh();
  }, [tab]);

  const login = () => {
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem('blossom_admin', '1');
      setAuthed(true); setError('');
    } else {
      setError('Incorrect PIN. Try: blossom2024');
      setPin('');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('blossom_admin');
    setAuthed(false); setPin('');
  };

  const tabsWithBadge = tabs.map(t => ({
    ...t,
    badge: t.id === 'reminders' ? (reminderCount > 0 ? String(reminderCount) : undefined)
         : t.id === 'appointments' ? (pendingCount > 0 ? String(pendingCount) : undefined)
         : undefined,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4"
        style={{ background: 'rgba(42,42,42,0.7)', backdropFilter: 'blur(12px)' }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-full max-w-2xl max-h-[92vh] bg-cream rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{ border: '1px solid rgba(232,164,184,0.3)' }}
        >
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-accent/15 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FFF8F5 0%, #FDE8EF 100%)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose to-rose-dark flex items-center justify-center shadow-md shadow-rose/20">
                {authed ? <FaUnlock className="text-white text-sm" /> : <FaLock className="text-white text-sm" />}
              </div>
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold text-dark leading-none">Admin Panel</h2>
                <p className="text-[8px] sm:text-[9px] text-dark/35 tracking-wider">Blossom Beauty Room</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {authed && (
                <button onClick={logout}
                  className="flex items-center gap-1.5 text-[10px] text-dark/40 hover:text-rose px-3 py-1.5 rounded-full glass hover:glass-rose transition-all">
                  <FaSignOutAlt className="text-[9px]" /> Logout
                </button>
              )}
              <button onClick={onClose}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-dark/50 hover:text-rose transition-colors">
                <FaTimes className="text-sm" />
              </button>
            </div>
          </div>

          {/* ─── Content ─── */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {!authed ? (
              /* ── LOGIN ── */
              <div className="flex-1 flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-xs text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-accent/30 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FaShieldAlt className="text-rose text-2xl" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-dark mb-1">Admin Access</h3>
                  <p className="text-[11px] text-dark/40 mb-5">Enter your PIN to continue</p>

                  <div className="relative mb-3">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && login()}
                      placeholder="Enter PIN"
                      className="w-full px-4 py-3.5 pr-12 rounded-xl border border-accent/25 bg-white/60 focus:border-rose focus:ring-2 focus:ring-rose/10 outline-none text-center font-serif text-lg tracking-[0.3em] text-dark placeholder:tracking-normal placeholder:font-sans placeholder:text-base placeholder:text-dark/25"
                    />
                    <button onClick={() => setShowPin(!showPin)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark/60">
                      {showPin ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-[10px] text-red-500 mb-3 flex items-center justify-center gap-1">
                        <FaExclamationTriangle className="text-[9px]" /> {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button onClick={login}
                    className="w-full btn-glow bg-gradient-to-r from-rose to-rose-dark text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-rose/20">
                    🌸 Enter Admin Panel
                  </button>

                  <p className="text-[9px] text-dark/25 mt-4">Default PIN: blossom2024</p>
                </motion.div>
              </div>
            ) : (
              /* ── DASHBOARD ── */
              <>
                {/* Tab bar */}
                <div className="flex gap-1 px-3 sm:px-4 py-2.5 border-b border-accent/15 overflow-x-auto hide-scrollbar flex-shrink-0"
                  style={{ background: 'rgba(255,248,245,0.8)' }}>
                  {tabsWithBadge.map(t => {
                    const TIcon = t.icon;
                    return (
                      <button key={t.id} onClick={() => setTab(t.id)}
                        className={`relative flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-[12px] font-medium transition-all duration-300 whitespace-nowrap ${
                          tab === t.id
                            ? 'bg-gradient-to-r from-rose to-rose-dark text-white shadow-md shadow-rose/20'
                            : 'text-dark/50 hover:bg-blush/30'
                        }`}>
                        <TIcon className="text-[9px] sm:text-[10px]" />
                        {t.label}
                        {t.badge && (
                          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${
                            tab === t.id ? 'bg-white text-rose' : 'bg-rose text-white'
                          }`}>{t.badge}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  <AnimatePresence mode="wait">
                    <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}>
                      {tab === 'reminders' && <Reminders />}
                      {tab === 'appointments' && <AppointmentManager />}
                      {tab === 'clients' && <OfflineClients />}
                      {tab === 'gallery' && <GalleryManager onUpdate={() => setReminderCount(getReminderCount())} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
