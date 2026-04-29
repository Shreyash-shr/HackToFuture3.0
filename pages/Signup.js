import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = ['Patient', 'Doctor', 'Radiologist', 'Researcher', 'Medical Student'];

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'Patient', age: '', gender: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const nextStep = (e) => {
    e.preventDefault();
    setError('');
    if (step === 1) {
      if (!form.name.trim()) return setError('Name is required');
      if (!form.email.includes('@')) return setError('Enter a valid email');
      if (form.password.length < 6) return setError('Password must be at least 6 characters');
      if (form.password !== form.confirm) return setError('Passwords do not match');
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const { confirm, ...data } = form;
    const result = signup(data);
    setLoading(false);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'relative', zIndex: 10 }}>
      <div style={{ width: '100%', maxWidth: '480px', animation: 'fade-in-up 0.5s ease forwards' }}>

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
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: s <= step ? 'linear-gradient(90deg, var(--teal), var(--cyan))' : 'rgba(255,255,255,0.08)',
                transition: 'all 0.4s',
              }} />
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', marginBottom: '0.5rem' }}>
            {step === 1 ? 'Create account' : 'Your profile'}
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            {step === 1 ? 'Join MediScan AI for free' : 'Tell us a bit about yourself (optional)'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(255,77,109,0.1)', border: '1px solid rgba(255,77,109,0.3)',
              borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '1.5rem',
              color: 'var(--red-alert)', fontSize: '0.875rem',
            }}>⚠ {error}</div>
          )}

          {step === 1 ? (
            <form onSubmit={nextStep}>
              {[
                { key: 'name', label: 'FULL NAME', type: 'text', placeholder: 'Dr. Priya Sharma' },
                { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'you@example.com' },
                { key: 'password', label: 'PASSWORD', type: 'password', placeholder: '••••••••' },
                { key: 'confirm', label: 'CONFIRM PASSWORD', type: 'password', placeholder: '••••••••' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{f.label}</label>
                  <input
                    type={f.type} required placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                    style={{
                      width: '100%', padding: '13px 16px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                      fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              ))}
              <button type="submit" style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
                border: 'none', borderRadius: 'var(--radius-sm)',
                color: 'var(--navy)', fontSize: '1rem', fontFamily: 'var(--font-body)',
                fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 0 20px rgba(0,201,177,0.3)',
              }}>Continue →</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>YOUR ROLE</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ROLES.map(r => (
                    <button key={r} type="button" onClick={() => update('role', r)} style={{
                      padding: '8px 16px', borderRadius: '100px',
                      background: form.role === r ? 'rgba(0,201,177,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${form.role === r ? 'rgba(0,201,177,0.5)' : 'var(--border)'}`,
                      color: form.role === r ? 'var(--teal)' : 'var(--muted)',
                      cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'var(--font-body)',
                      transition: 'all 0.2s',
                    }}>{r}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>AGE</label>
                  <input type="number" placeholder="28" value={form.age} onChange={e => update('age', e.target.value)}
                    style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--muted)', display: 'block', marginBottom: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>GENDER</label>
                  <select value={form.gender} onChange={e => update('gender', e.target.value)}
                    style={{ width: '100%', padding: '13px 16px', background: 'var(--navy-mid)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: form.gender ? 'var(--white)' : 'var(--muted)', fontSize: '0.95rem', fontFamily: 'var(--font-body)', outline: 'none', cursor: 'pointer' }}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep(1)} style={{
                  flex: 1, padding: '15px', background: 'transparent',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  color: 'var(--muted)', fontSize: '0.95rem', fontFamily: 'var(--font-body)',
                  fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                }}>← Back</button>
                <button type="submit" disabled={loading} style={{
                  flex: 2, padding: '15px',
                  background: loading ? 'rgba(0,201,177,0.5)' : 'linear-gradient(135deg, var(--teal), var(--cyan))',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  color: 'var(--navy)', fontSize: '1rem', fontFamily: 'var(--font-body)',
                  fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                  boxShadow: '0 0 20px rgba(0,201,177,0.3)',
                }}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid var(--navy)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'rotate-slow 0.7s linear infinite' }} />
                      Creating...
                    </span>
                  ) : 'Create Account →'}
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: 'var(--teal)', cursor: 'pointer', fontWeight: 500 }}>
              Sign in →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}