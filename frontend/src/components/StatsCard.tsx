import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  accentColor?: string;
  delay?: number;
  trend?: string;
}

export default function StatsCard({ label, value, unit, icon, accentColor = 'var(--accent-primary)', delay = 0, trend }: Props) {
  return (
    <motion.div
      className="card card-glow-top"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100,
        borderRadius: '50%',
        background: accentColor,
        opacity: 0.05,
        filter: 'blur(20px)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: '10px',
          background: `color-mix(in srgb, ${accentColor} 15%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor,
        }}>
          {icon}
        </div>
        {trend && (
          <span style={{
            fontSize: '11px',
            color: trend.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)',
            background: trend.startsWith('+') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            padding: '2px 8px',
            borderRadius: '20px',
            fontWeight: 600,
          }}>
            {trend}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </motion.span>
        {unit && (
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{unit}</span>
        )}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 500 }}>
        {label}
      </div>
    </motion.div>
  );
}