import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  reverse: boolean;
  type: number;
  color: string;
}

const colors = ['#E8A4B8', '#F8D7E3', '#CDB4DB', '#C88B8B', '#FDE8EF', '#e0bcc7'];

function PetalSVG({ type, color, lighter = '#FDE8EF' }: { type: number; color: string; lighter?: string }) {
  switch (type % 4) {
    case 0:
      return (<svg viewBox="0 0 32 32"><ellipse cx="16" cy="12" rx="8" ry="12" fill={color} transform="rotate(10 16 16)" /><ellipse cx="16" cy="12" rx="4.5" ry="7" fill={lighter} transform="rotate(10 16 16)" opacity="0.45" /></svg>);
    case 1:
      return (<svg viewBox="0 0 32 32"><path d="M16 3c-5 6-10 12-10 17a10 10 0 0020 0c0-5-5-11-10-17z" fill={color} /><path d="M16 3c-5 6-10 12-10 17a10 10 0 0010 10" fill={lighter} opacity="0.4" /></svg>);
    case 2:
      return (<svg viewBox="0 0 32 32"><ellipse cx="16" cy="8" rx="5" ry="8" fill={color} /><ellipse cx="23" cy="14" rx="5" ry="8" fill={color} transform="rotate(72 23 14)" /><ellipse cx="21" cy="24" rx="5" ry="8" fill={color} transform="rotate(144 21 24)" /><ellipse cx="11" cy="24" rx="5" ry="8" fill={color} transform="rotate(216 11 24)" /><ellipse cx="9" cy="14" rx="5" ry="8" fill={color} transform="rotate(288 9 14)" /><circle cx="16" cy="16" r="2.5" fill="#D4A574" opacity="0.55" /></svg>);
    default:
      return (<svg viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="10" ry="6" fill={color} transform="rotate(-25 16 16)" /><ellipse cx="16" cy="16" rx="6" ry="3.5" fill={lighter} transform="rotate(-25 16 16)" opacity="0.4" /></svg>);
  }
}

export default function FloatingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const isMob = window.innerWidth < 768;
    const count = isMob ? 12 : 22;
    setPetals(Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: isMob ? 7 + Math.random() * 11 : 10 + Math.random() * 18,
      duration: 12 + Math.random() * 18,
      delay: Math.random() * 20,
      opacity: 0.2 + Math.random() * 0.5,
      reverse: Math.random() > 0.5,
      type: Math.floor(Math.random() * 4),
      color: colors[i % colors.length],
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[45] overflow-hidden" aria-hidden="true">
      {petals.map(p => (
        <div key={p.id}
          className={`petal ${p.reverse ? 'animate-float-petal-reverse' : 'animate-float-petal'}`}
          style={{ left: `${p.left}%`, top: '-20px', width: p.size, height: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`, opacity: 0 }}>
          <div style={{ opacity: p.opacity }}>
            <PetalSVG type={p.type} color={p.color} />
          </div>
        </div>
      ))}
    </div>
  );
}
