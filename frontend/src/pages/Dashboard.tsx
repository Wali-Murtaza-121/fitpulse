import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getStats, Stats } from '../api/client';
import StatsCard from '../components/StatsCard';

const container = {
  animate: { transition: { staggerChildren: 0.08 } },
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then((r) => setStats(r.data))
      .catch(() => setError('Failed to load stats. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const maxCal = stats ? Math.max(...stats.weekly_activity.map((d) => d.calories), 1) : 1;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your fitness overview at a glance</p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px' }}>
          ⚠️ {error}
        </motion.div>
      )}

      {loading ? (
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}>
          {[0, 1, 2].map((i) => (
            <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              style={{ width: '100%', height: '100px', background: 'var(--bg-card)', borderRadius: 'var(--radius)' }} />
          ))}
        </div>
      ) : stats && (
        <>
          <motion.div className="grid-3" variants={container} initial="initial" animate="animate" style={{ marginBottom: '24px' }}>
            <StatsCard label="Total Workouts" value={stats.total_workouts} icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 5v14M18 5v14M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/>
              </svg>
            } delay={0} trend="+3 this week" />
            <StatsCard label="Calories Burned" value={stats.total_calories.toLocaleString()} unit="kcal" accentColor="var(--accent-orange)" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            } delay={0.08} trend="+12%" />
            <StatsCard label="Total Minutes" value={stats.total_minutes} unit="min" accentColor="var(--accent-secondary)" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
              </svg>
            } delay={0.16} />
          </motion.div>

          <div className="grid-2" style={{ marginBottom: '24px' }}>
            {/* Weekly Activity */}
            <motion.div className="card card-glow-top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '20px', fontSize: '15px' }}>
                Weekly Calories
              </div>
              {stats.weekly_activity.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '30px 0' }}>
                  No workouts in the past 7 days
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
                  {stats.weekly_activity.map((d, i) => (
                    <motion.div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.3 + i * 0.06, type: 'spring' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.calories}</div>
                      <motion.div
                        style={{
                          width: '100%',
                          height: `${(d.calories / maxCal) * 80}px`,
                          background: 'linear-gradient(to top, var(--accent-primary), var(--accent-secondary))',
                          borderRadius: '4px 4px 2px 2px',
                          minHeight: 6,
                          transformOrigin: 'bottom',
                          cursor: 'pointer',
                        }}
                        whileHover={{ opacity: 0.8 }}
                        title={`${d.date}: ${d.calories} kcal`}
                      />
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {new Date(d.date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' })}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Category Breakdown */}
            <motion.div className="card card-glow-top" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '20px', fontSize: '15px' }}>
                Category Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {stats.by_category.map((c, i) => {
                  const pct = Math.round((c.count / stats.total_workouts) * 100);
                  const colors: Record<string, string> = {
                    Cardio: 'var(--accent-red)', Strength: 'var(--accent-secondary)',
                    Flexibility: 'var(--accent-green)', HIIT: 'var(--accent-orange)', Other: 'var(--text-muted)',
                  };
                  const color = colors[c.category] || 'var(--text-muted)';
                  return (
                    <div key={c.category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.category}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.count} sessions · {pct}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-secondary)', borderRadius: 4 }}>
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          style={{ height: '100%', background: color, borderRadius: 4 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Avg duration card */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,229,255,0.05))' }}>
            <div style={{ fontSize: '36px' }}>🎯</div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Average Session Duration</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700 }}>
                {stats.avg_duration} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>minutes per workout</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}