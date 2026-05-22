import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getWorkouts, Workout } from '../api/client';
import WorkoutForm from '../components/WorkoutForm';

const catTag: Record<string, string> = {
  Cardio: 'tag-cardio', Strength: 'tag-strength',
  Flexibility: 'tag-flexibility', HIIT: 'tag-hiit', Other: 'tag-other',
};

export default function WorkoutLog() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const CATEGORIES = ['All', 'Cardio', 'Strength', 'Flexibility', 'HIIT', 'Other'];

  const load = useCallback(() => {
    setLoading(true);
    getWorkouts()
      .then((r) => setWorkouts(r.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = filter === 'All' ? workouts : workouts.filter((w) => w.category === filter);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Workout Log</h1>
        <p className="page-subtitle">Track every session, every rep, every mile</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Left: list */}
        <div>
          {/* Filter pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <motion.button key={cat} whileHover={{ y: -1 }} whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(cat)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', border: 'none', letterSpacing: '0.3px',
                  background: filter === cat ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: filter === cat ? '#000' : 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                {cat}
              </motion.button>
            ))}
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  style={{ height: 80, background: 'var(--bg-card)', borderRadius: 'var(--radius)' }} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏋️</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '6px' }}>No workouts yet</div>
              <div style={{ fontSize: '13px' }}>Log your first session using the form →</div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {visible.map((w, i) => (
                <motion.div key={w.id} className="card"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{ x: 4 }}
                  style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'default' }}>
                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    borderRadius: '12px',
                    background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px',
                  }}>
                    {w.category === 'Cardio' ? '🏃' : w.category === 'Strength' ? '💪' : w.category === 'Flexibility' ? '🧘' : w.category === 'HIIT' ? '⚡' : '🎯'}
                  </div>
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px' }}>{w.title}</span>
                      <span className={`tag ${catTag[w.category] || 'tag-other'}`}>{w.category}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(w.workout_date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {w.notes && ` · ${w.notes}`}
                    </div>
                  </div>
                  {/* Stats */}
                  <div style={{ display: 'flex', gap: '20px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>{w.duration_minutes}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>min</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--accent-orange)' }}>{w.calories_burned}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>kcal</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right: form */}
        <div style={{ position: 'sticky', top: '24px' }}>
          <WorkoutForm onSuccess={load} />
        </div>
      </div>
    </div>
  );
}