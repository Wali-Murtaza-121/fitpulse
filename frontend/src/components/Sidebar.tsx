import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';

const navItems = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    path: '/workouts',
    label: 'Workout Log',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 5v14M18 5v14M6 12h12M3 8h3M18 8h3M3 16h3M18 16h3"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -240 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        width: 'var(--sidebar-width)',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 16px',
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '40px', paddingLeft: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <motion.div
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
            style={{
              width: 10, height: 10,
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              boxShadow: '0 0 12px var(--accent-primary)',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
          }}>
            FitPulse
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
          PERFORMANCE TRACKER
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          fontWeight: 600,
          padding: '0 12px',
          marginBottom: '8px',
        }}>
          MAIN MENU
        </div>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  background: active ? 'rgba(0,229,255,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(0,229,255,0.15)' : '1px solid transparent',
                  cursor: 'pointer',
                  fontWeight: active ? 600 : 400,
                  fontSize: '14px',
                }}
              >
                {item.icon}
                {item.label}
                {active && (
                  <motion.div
                    layoutId="active-indicator"
                    style={{
                      marginLeft: 'auto',
                      width: 4, height: 4,
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                    }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: 32, height: 32,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-secondary), var(--accent-primary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: '#fff',
        }}>A</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 500 }}>Athlete</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pro Member</div>
        </div>
      </div>
    </motion.aside>
  );
}