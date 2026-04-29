import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DISEASES = ['Pneumonia', 'Tuberculosis', 'Lung Opacity', 'Pleural Effusion', 'Cardiomegaly', 'Atelectasis', 'Nodule', 'Mass'];

export default function Landing() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let frame;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,201,177,${p.opacity})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,201,177,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      frame = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 1 }} />

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 3rem' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem' }}>
          Medi<span style={{ color: 'var(--teal)' }}>Scan</span> AI
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--offwhite)', padding: '10px 24px', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font-body)', fontWeight: 500,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--teal)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >Sign In</button>
          <button onClick={() => navigate('/signup')} style={{
            background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
            border: 'none', color: 'var(--navy)', padding: '10px 24px',
            borderRadius: 'var(--radius-sm)', cursor: 'pointer',
            fontSize: '0.9rem', fontFamily: 'var(--font-body)', fontWeight: 700,
            transition: 'all 0.2s',
          }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', margin: '0 auto', padding: '5rem 3rem 3rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
          borderRadius: '100px', padding: '6px 18px', marginBottom: '2rem',
          fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--teal)', letterSpacing: '0.05em',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'pulse-ring 2s infinite' }} />
          Blood_Moon_Coders · MULTIMODAL DIAGNOSIS SYSTEM
        </div>

        <h1 style={{
          fontFamily: 'var(--font-head)', fontSize: 'clamp(3rem, 7vw, 5.5rem)',
          lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem',
        }}>
          Chest Disease Detection<br />
          <span style={{ color: 'var(--teal)' }}>Powered by AI</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--muted)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
          Upload a chest X-ray or CT scan. Our deep learning model detects multiple diseases simultaneously and explains results in plain language.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
          <button onClick={() => navigate('/signup')} style={{
            background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
            border: 'none', color: 'var(--navy)', padding: '16px 40px',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 700,
            boxShadow: '0 0 30px rgba(0,201,177,0.35)', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >Start Free Analysis →</button>
          <button onClick={() => navigate('/login')} style={{
            background: 'var(--glass)', border: '1px solid var(--border)',
            color: 'var(--white)', padding: '16px 40px',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 500,
            backdropFilter: 'blur(10px)', transition: 'all 0.2s',
          }}>Sign In</button>
        </div>

        {/* Disease tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '4rem' }}>
          {DISEASES.map(d => (
            <span key={d} style={{
              background: 'rgba(0,201,177,0.06)', border: '1px solid rgba(0,201,177,0.15)',
              color: 'var(--muted)', padding: '6px 14px', borderRadius: '100px',
              fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
            }}>{d}</span>
          ))}
          <span style={{
            background: 'rgba(0,201,177,0.06)', border: '1px solid rgba(0,201,177,0.15)',
            color: 'var(--teal)', padding: '6px 14px', borderRadius: '100px',
            fontSize: '0.8rem', fontFamily: 'var(--font-mono)',
          }}>+8 more</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '700px', margin: '0 auto 5rem' }}>
          {[
            { n: '14+', label: 'Disease Classes' },
            { n: '94%', label: 'AUC Score' },
            { n: 'CPU', label: 'No GPU Needed' },
          ].map(s => (
            <div key={s.n} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '1.5rem',
              backdropFilter: 'blur(20px)',
            }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', color: 'var(--teal)', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '6px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '◎', title: 'Multi-label Detection', desc: 'Detects 14+ chest diseases simultaneously in a single scan' },
            { icon: '◈', title: 'AI Patient Chatbot', desc: 'Explains your results in simple, jargon-free language' },
            { icon: '◷', title: 'Confidence Scoring', desc: 'Each finding comes with a probability score for transparency' },
            { icon: '⬡', title: 'Scan History', desc: 'Track all past scans and monitor changes over time' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)', padding: '1.75rem',
              backdropFilter: 'blur(20px)', textAlign: 'left',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,201,177,0.4)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '1.8rem', color: 'var(--teal)', marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: '4rem', padding: '1rem 1.5rem',
          background: 'rgba(255,200,87,0.06)', border: '1px solid rgba(255,200,87,0.2)',
          borderRadius: 'var(--radius-md)', maxWidth: '600px', margin: '4rem auto 2rem',
          fontSize: '0.8rem', color: 'rgba(255,200,87,0.8)', lineHeight: 1.6,
          fontFamily: 'var(--font-mono)',
        }}>
          ⚠ This tool is for informational purposes only and does not provide medical diagnosis. Always consult a licensed physician.
        </div>
      </div>
    </div>
  );
}