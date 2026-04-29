import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TIPS = [
  'Always upload high-resolution X-ray images for best accuracy.',
  'CT scans provide more detail than plain X-rays for complex cases.',
  'Results should always be reviewed by a qualified radiologist.',
  'Keep your scan history for comparison at follow-up visits.',
  'Multi-label detection means multiple conditions can coexist.',
];

export default function Dashboard() {
  const { user, scanHistory } = useAuth();
  const navigate = useNavigate();
  const tip = TIPS[Math.floor(Date.now() / 86400000) % TIPS.length];

  const stats = [
    { label: 'Total Scans', value: scanHistory.length, icon: '◎', color: 'var(--teal)' },
    { label: 'Findings Detected', value: scanHistory.filter(s => s.findings?.some(f => f.confidence > 0.4)).length, icon: '⬡', color: 'var(--amber)' },
    { label: 'Normal Scans', value: scanHistory.filter(s => !s.findings?.some(f => f.confidence > 0.5)).length, icon: '◈', color: 'var(--green-safe)' },
    { label: 'Last Scan', value: scanHistory[0] ? new Date(scanHistory[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—', icon: '◷', color: 'var(--cyan)' },
  ];

  const quickActions = [
    { label: 'New Scan', desc: 'Upload a chest X-ray or CT scan for AI analysis', icon: '◎', color: 'var(--teal)', path: '/scan' },
    { label: 'AI Chatbot', desc: 'Ask questions about your results or chest conditions', icon: '◈', color: 'var(--cyan)', path: '/chat' },
    { label: 'Scan History', desc: 'Review all your previous scans and reports', icon: '◷', color: 'var(--amber)', path: '/history' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', animation: 'fade-in-up 0.5s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-safe)', animation: 'pulse-ring 2s infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>SYSTEM ONLINE</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '6px' }}>
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span style={{ color: 'var(--teal)' }}>{user?.name?.split(' ')[0]}</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            {user?.role && <span style={{ marginRight: 8, background: 'rgba(0,201,177,0.1)', color: 'var(--teal)', padding: '2px 10px', borderRadius: '100px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>{user.role}</span>}
            Here's your MediScan overview
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', animation: 'fade-in-up 0.5s 0.1s ease both' }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '1.5rem',
              backdropFilter: 'blur(20px)', transition: 'all 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${s.color}44`}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '1.5rem', color: s.color, marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', animation: 'fade-in-up 0.5s 0.2s ease both' }}>
          {/* Quick Actions */}
          <div>
            <h3 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: '1rem' }}>QUICK ACTIONS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quickActions.map(a => (
                <div key={a.label} onClick={() => navigate(a.path)} style={{
                  background: 'var(--card-bg)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)', padding: '1.5rem',
                  backdropFilter: 'blur(20px)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  transition: 'all 0.25s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}44`; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 'var(--radius-sm)',
                    background: `${a.color}15`, border: `1px solid ${a.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.6rem', color: a.color, flexShrink: 0,
                  }}>{a.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '3px' }}>{a.label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{a.desc}</div>
                  </div>
                  <span style={{ color: 'var(--muted)', fontSize: '1.2rem' }}>→</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Tip */}
            <div style={{
              background: 'rgba(0,201,177,0.06)', border: '1px solid rgba(0,201,177,0.2)',
              borderRadius: 'var(--radius-md)', padding: '1.5rem',
            }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: '10px' }}>💡 CLINICAL TIP</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--offwhite)', lineHeight: 1.6 }}>{tip}</p>
            </div>

            {/* Recent scans */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', backdropFilter: 'blur(20px)', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.1em' }}>RECENT SCANS</div>
                <span onClick={() => navigate('/history')} style={{ fontSize: '0.75rem', color: 'var(--teal)', cursor: 'pointer' }}>View all →</span>
              </div>
              {scanHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.4 }}>◎</div>
                  <div style={{ fontSize: '0.85rem' }}>No scans yet</div>
                  <button onClick={() => navigate('/scan')} style={{
                    marginTop: '1rem', background: 'var(--teal-glow)', border: '1px solid rgba(0,201,177,0.3)',
                    color: 'var(--teal)', padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-body)',
                  }}>Upload First Scan</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {scanHistory.slice(0, 3).map((s, i) => (
                    <div key={i} onClick={() => navigate('/results', { state: { result: s } })} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.03)', cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.findings?.some(f => f.confidence > 0.5) ? 'var(--red-alert)' : 'var(--green-safe)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.filename || 'Scan'}</div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{new Date(s.date).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'rgba(255,200,87,0.05)', border: '1px solid rgba(255,200,87,0.15)',
              borderRadius: 'var(--radius-md)', padding: '1rem',
            }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,200,87,0.7)', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
                ⚠ AI results are indicative only. Consult a qualified physician for diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}