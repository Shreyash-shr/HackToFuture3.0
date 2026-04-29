import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SEVERITY_COLOR = { High: 'var(--red-alert)', Moderate: 'var(--amber)', Low: 'var(--green-safe)' };
const DISEASE_INFO = {
  Pneumonia: 'An infection that inflames air sacs in one or both lungs, which may fill with fluid or pus.',
  Tuberculosis: 'A potentially serious infectious disease mainly affecting the lungs, caused by Mycobacterium tuberculosis.',
  'Lung Opacity': 'A region of increased density in the lung that may indicate fluid, inflammation, or consolidation.',
  'Pleural Effusion': 'Excess fluid accumulation between the layers of tissue lining the lungs and chest cavity.',
  Cardiomegaly: 'An enlarged heart, which may indicate underlying cardiovascular disease.',
  Atelectasis: 'Collapse or incomplete expansion of a lung or lobe of a lung.',
  Consolidation: 'Solidification of lung tissue, typically from infection or inflammation.',
  Edema: 'Fluid accumulation in the lungs, which can impair breathing.',
  Emphysema: 'A lung condition causing air spaces to enlarge and lose elasticity.',
  Fibrosis: 'Scarring of lung tissue that can reduce lung function over time.',
  Nodule: 'A small, rounded growth in the lung that may be benign or require monitoring.',
  Mass: 'A larger abnormal growth in the lung that requires further evaluation.',
  Pneumothorax: 'Collapsed lung due to air leaking into the space between the lung and chest wall.',
  Infiltration: 'Abnormal material in the lung tissue, often indicating infection or inflammation.',
};

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;
  const [expanded, setExpanded] = useState(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (!result) navigate('/scan');
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, [result, navigate]);

  if (!result) return null;

  const positive = result.findings.filter(f => f.confidence >= 0.5);
  const borderline = result.findings.filter(f => f.confidence >= 0.3 && f.confidence < 0.5);
  const negative = result.findings.filter(f => f.confidence < 0.3);
  const overallRisk = positive.length > 0 ? (positive.some(f => f.confidence > 0.75) ? 'High' : 'Moderate') : 'Low';

  const riskStyle = {
    High: { bg: 'rgba(255,77,109,0.1)', border: 'rgba(255,77,109,0.3)', color: 'var(--red-alert)', dot: 'var(--red-alert)' },
    Moderate: { bg: 'rgba(255,200,87,0.1)', border: 'rgba(255,200,87,0.3)', color: 'var(--amber)', dot: 'var(--amber)' },
    Low: { bg: 'rgba(78,203,113,0.1)', border: 'rgba(78,203,113,0.3)', color: 'var(--green-safe)', dot: 'var(--green-safe)' },
  }[overallRisk];

  const FindingBar = ({ finding, index }) => {
    const pct = Math.round(finding.confidence * 100);
    const col = pct >= 50 ? 'var(--red-alert)' : pct >= 30 ? 'var(--amber)' : 'var(--green-safe)';
    return (
      <div style={{ marginBottom: '10px', animation: animated ? `fade-in-up 0.4s ${index * 0.06}s ease both` : 'none', opacity: animated ? 1 : 0 }}>
        <div onClick={() => setExpanded(expanded === finding.name ? null : finding.name)} style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--radius-sm)', padding: '14px 16px', cursor: 'pointer',
          transition: 'all 0.2s',
          borderLeftColor: col, borderLeftWidth: 3,
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{finding.name}</span>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: `${col}18`, color: col, padding: '2px 8px', borderRadius: '100px', border: `1px solid ${col}40` }}>{finding.category}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: col }}>{pct}%</div>
              <div style={{ fontSize: '0.7rem', color: SEVERITY_COLOR[finding.severity] }}>{finding.severity}</div>
            </div>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem', transition: 'transform 0.2s', transform: expanded === finding.name ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
          </div>
          {/* Bar */}
          <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: pct >= 50 ? 'linear-gradient(90deg, #ff4d6d, #ff758c)' : pct >= 30 ? 'linear-gradient(90deg, #ffc857, #ffd480)' : 'linear-gradient(90deg, var(--green-safe), #80e39a)',
              width: animated ? `${pct}%` : '0%',
              transition: animated ? `width 1s ${index * 0.08}s cubic-bezier(0.4,0,0.2,1)` : 'none',
              boxShadow: `0 0 8px ${col}60`,
            }} />
          </div>
          {/* Expanded info */}
          {expanded === finding.name && (
            <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(0,201,177,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,201,177,0.15)' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--offwhite)', lineHeight: 1.6 }}>
                {DISEASE_INFO[finding.name] || 'Detected abnormality. Please consult a physician for further evaluation.'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic' }}>
                ℹ This is an AI-assisted finding. Clinical correlation is required.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', animation: 'fade-in-up 0.5s ease forwards' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: '8px' }}>◎ ANALYSIS COMPLETE</div>
            <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', marginBottom: '6px' }}>Scan Results</h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              {result.filename} · {new Date(result.date).toLocaleString('en-IN')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/scan')} style={{
              background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.25)',
              color: 'var(--teal)', padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '0.9rem',
            }}>New Scan</button>
            <button onClick={() => navigate('/chat', { state: { result } })} style={{
              background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
              border: 'none', color: 'var(--navy)', padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem',
            }}>◈ Ask AI →</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Left: image + summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Image */}
            <div style={{ background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {result.imageData ? (
                <img src={result.imageData} alt="Scan" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'contrast(1.1)' }} />
              ) : (
                <div style={{ color: 'var(--muted)', fontSize: '3rem', opacity: 0.3 }}>◎</div>
              )}
            </div>

            {/* Overall risk */}
            <div style={{ background: riskStyle.bg, border: `1px solid ${riskStyle.border}`, borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: riskStyle.dot, animation: 'pulse-ring 2s infinite' }} />
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: riskStyle.color, letterSpacing: '0.08em' }}>OVERALL RISK</span>
              </div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', color: riskStyle.color }}>{overallRisk}</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '6px', lineHeight: 1.5 }}>{result.summary}</p>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { n: positive.length, label: 'Positive', color: 'var(--red-alert)' },
                { n: borderline.length, label: 'Borderline', color: 'var(--amber)' },
                { n: negative.length, label: 'Negative', color: 'var(--green-safe)' },
                { n: result.findings.length, label: 'Total Checked', color: 'var(--teal)' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem', color: s.color }}>{s.n}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: findings */}
          <div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', backdropFilter: 'blur(20px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, flex: 1 }}>All Findings</h2>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[{ c: 'var(--red-alert)', l: '≥50%' }, { c: 'var(--amber)', l: '30-49%' }, { c: 'var(--green-safe)', l: '<30%' }].map(b => (
                    <span key={b.l} style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: b.c, background: `${b.c}15`, padding: '2px 8px', borderRadius: '100px' }}>{b.l}</span>
                  ))}
                </div>
              </div>

              {positive.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--red-alert)', letterSpacing: '0.1em', marginBottom: '8px' }}>SIGNIFICANT FINDINGS</div>
                  {positive.map((f, i) => <FindingBar key={f.name} finding={f} index={i} />)}
                </div>
              )}
              {borderline.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--amber)', letterSpacing: '0.1em', marginBottom: '8px' }}>BORDERLINE</div>
                  {borderline.map((f, i) => <FindingBar key={f.name} finding={f} index={positive.length + i} />)}
                </div>
              )}
              {negative.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--green-safe)', letterSpacing: '0.1em', marginBottom: '8px' }}>WITHIN NORMAL RANGE</div>
                  {negative.map((f, i) => <FindingBar key={f.name} finding={f} index={positive.length + borderline.length + i} />)}
                </div>
              )}
            </div>

            {/* CTA */}
            <div style={{ marginTop: '1rem', background: 'rgba(0,201,177,0.06)', border: '1px solid rgba(0,201,177,0.2)', borderRadius: 'var(--radius-md)', padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>Need to understand these results?</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Ask our AI chatbot to explain findings in plain language.</div>
              </div>
              <button onClick={() => navigate('/chat', { state: { result } })} style={{
                background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
                border: 'none', color: 'var(--navy)', padding: '12px 22px',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>Chat with AI →</button>
            </div>

            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,200,87,0.05)', border: '1px solid rgba(255,200,87,0.15)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'rgba(255,200,87,0.7)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
              ⚠ These are AI-generated findings. This is NOT a medical diagnosis. Please consult a licensed radiologist or pulmonologist for clinical evaluation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}