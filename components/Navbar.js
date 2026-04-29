import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
    { path: '/scan', label: 'New Scan', icon: '◎' },
    { path: '/history', label: 'History', icon: '◷' },
    { path: '/chat', label: 'AI Chat', icon: '◈' },
  ];

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: '0 2rem',
      background: scrolled ? 'rgba(10,22,40,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,201,177,0.12)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: 36, height: 36, borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 700, color: 'var(--navy)',
        }}>M</div>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', letterSpacing: '-0.02em' }}>
          Medi<span style={{ color: 'var(--teal)' }}>Scan</span>
        </span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        {links.map(link => (
          <button key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: location.pathname === link.path ? 'var(--teal-glow)' : 'transparent',
              border: location.pathname === link.path ? '1px solid rgba(0,201,177,0.3)' : '1px solid transparent',
              color: location.pathname === link.path ? 'var(--teal)' : 'var(--muted)',
              padding: '8px 16px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)',
              fontWeight: 500, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
            onMouseEnter={e => { if (location.pathname !== link.path) { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
            onMouseLeave={e => { if (location.pathname !== link.path) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}}
          >
            <span style={{ fontSize: '1rem' }}>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </div>

      {/* User menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 12px', borderRadius: 'var(--radius-sm)',
          background: 'var(--glass)', border: '1px solid var(--border)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--navy)',
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--offwhite)', fontWeight: 500 }}>{user?.name}</span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'transparent', border: '1px solid rgba(255,77,109,0.3)',
          color: 'var(--red-alert)', padding: '8px 16px', borderRadius: 'var(--radius-sm)',
          cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)',
          fontWeight: 500, transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,77,109,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >Logout</button>
      </div>
    </nav>
  );
}