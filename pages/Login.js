import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(form.email, form.password);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  const demoLogin = () => {
    setForm({ email: 'demo@mediscan.ai', password: 'demo123' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 10 }}>
      <div style={{ width: '100%', maxWidth: '460px', animation: 'fade-in-up 0.5s ease forwards' }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', justifyContent: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'linear-gradient(135deg, var(--teal), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: 'var(--navy)' }}>M</div>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem' }}>Medi<span style={{ color: 'var(--teal)' }}>Scan</span> AI</span>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', padding: '2.5rem',
          backdropFilter: 'blur(30px)', boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Sign in to your MediScan account</p>

          {error && (
            <div style={{
              background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '1.5rem',
              color: 'var(--red-alert)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
              <input
                type="email" required placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                  fontSize: '0.95rem', fontFamily: 'var(--font-body)',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                    fontSize: '0.95rem', fontFamily: 'var(--font-body)',
                    outline: 'none', transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem',
                }}>{showPass ? '◉' : '◎'}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '15px',
              background: loading ? 'rgba(0,201,177,0.5)' : 'linear-gradient(135deg, var(--teal), var(--cyan))',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'var(--navy)', fontSize: '1rem', fontFamily: 'var(--font-body)',
              fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.2s', letterSpacing: '0.02em',
              boxShadow: loading ? 'none' : '0 0 20px rgba(0,201,177,0.3)',
            }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid var(--navy)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'rotate-slow 0.7s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button onClick={demoLogin} style={{
              background: 'rgba(0,201,177,0.06)', border: '1px dashed rgba(0,201,177,0.3)',
              color: 'var(--teal)', padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-mono)',
              width: '100%', transition: 'all 0.2s',
            }}>⚡ Use Demo Account</button>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted)' }}>
            No account yet?{' '}
            <span onClick={() => navigate('/signup')} style={{ color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
              Create one free →
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(139,163,199,0.5)', marginTop: '1.5rem', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
          For informational purposes only.<br />Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
}