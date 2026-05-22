import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { createWorkout, WorkoutCreate } from '../api/client';

interface Props {
  onSuccess: () => void;
}

const CATEGORIES = ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Other'];

export default function WorkoutForm({ onSuccess }: Props) {
  const [form, setForm] = useState<WorkoutCreate>({
    title: '',
    category: 'Cardio',
    duration_minutes: 30,
    calories_burned: 200,
    notes: '',
    workout_date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key: keyof WorkoutCreate, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError('Workout title is required'); return; }
    setLoading(true); setError(''); setSuccess(false);
    try {
      await createWorkout(form);
      setSuccess(true);
      setForm({ title: '', category: 'Cardio', duration_minutes: 30, calories_burned: 200, notes: '', workout_date: new Date().toISOString().split('T')[0] });
      setTimeout(() => { setSuccess(false); onSuccess(); }, 1200);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      setError(err?.response?.data?.error || 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <div style={{
          width: 36, height: 36,
          background: 'rgba(0,229,255,0.1)',
          border: '1px solid rgba(0,229,255,0.2)',
          borderRadius: '9px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent-primary)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>Log Workout</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Add a new session</div>
        </div>
      </div>

      <div className="form-group">
        <label>Workout Name</label>
        <input
          placeholder="e.g. Morning Run, Chest Day..."
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="form-group">
          <label>Category</label>
          <select value={form.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={form.workout_date} onChange={(e) => set('workout_date', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Duration (mins)</label>
          <input type="number" min={1} value={form.duration_minutes} onChange={(e) => set('duration_minutes', parseInt(e.target.value) || 0)} />
        </div>
        <div className="form-group">
          <label>Calories Burned</label>
          <input type="number" min={0} value={form.calories_burned} onChange={(e) => set('calories_burned', parseInt(e.target.value) || 0)} />
        </div>
      </div>

      <div className="form-group">
        <label>Notes (optional)</label>
        <textarea rows={2} placeholder="How did it go?" value={form.notes} onChange={(e) => set('notes', e.target.value)} style={{ resize: 'none' }} />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px' }}
          >{error}</motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            Workout saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
        {loading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%' }} />
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Save Workout
          </>
        )}
      </button>
    </motion.div>
  );
}