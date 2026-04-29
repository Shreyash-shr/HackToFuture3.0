import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DISEASE_POOL = [
  { name: 'Pneumonia', category: 'Infection' },
  { name: 'Tuberculosis', category: 'Infection' },
  { name: 'Lung Opacity', category: 'Opacity' },
  { name: 'Pleural Effusion', category: 'Fluid' },
  { name: 'Cardiomegaly', category: 'Cardiac' },
  { name: 'Atelectasis', category: 'Collapse' },
  { name: 'Consolidation', category: 'Opacity' },
  { name: 'Edema', category: 'Fluid' },
  { name: 'Emphysema', category: 'Obstructive' },
  { name: 'Fibrosis', category: 'Structural' },
  { name: 'Nodule', category: 'Mass' },
  { name: 'Mass', category: 'Mass' },
  { name: 'Pneumothorax', category: 'Collapse' },
  { name: 'Infiltration', category: 'Opacity' },
];

function simulateAnalysis() {
  const shuffled = [...DISEASE_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 8).map(d => ({
    ...d,
    confidence: Math.random(),
    severity: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Moderate' : 'Low',
  })).sort((a, b) => b.confidence - a.confidence);
}

const STAGES = [
  { label: 'Preprocessing image', detail: 'Normalizing pixel values...' },
  { label: 'Running CNN inference', detail: 'DenseNet-121 forward pass...' },
  { label: 'Multi-label detection', detail: 'Sigmoid activation per class...' },
  { label: 'Generating confidence scores', detail: 'Calibrating probabilities...' },
  { label: 'Preparing report', detail: 'Formatting findings...' },
];

export default function Scanner() {
  const navigate = useNavigate();
  const { addScanResult } = useAuth();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [stage, setStage] = useState(-1); // -1 = idle, 0-4 = progress, 5 = done
  const [stageProgress, setStageProgress] = useState(0);
  const inputRef = useRef(null);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const runAnalysis = async () => {
    setStage(0); setStageProgress(0);
    for (let i = 0; i < STAGES.length; i++) {
      setStage(i);
      for (let p = 0; p <= 100; p += 5) {
        setStageProgress(p);
        await new Promise(r => setTimeout(r, 28));
      }
    }
    const findings = simulateAnalysis();
    const result = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      filename: file.name,
      imageData: preview,
      findings,
      summary: findings[0].confidence > 0.6
        ? `Possible ${findings[0].name} detected with ${Math.round(findings[0].confidence * 100)}% confidence. Further evaluation recommended.`
        : 'No significant abnormalities detected. Results appear within normal range.',
    };
    addScanResult(result);
    setStage(5);
    setTimeout(() => navigate('/results', { state: { result } }), 800);
  };

  const overallProgress = stage < 0 ? 0 : stage >= 5 ? 100 : Math.round((stage / STAGES.length) * 100 + stageProgress / STAGES.length);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', animation: 'fade-in-up 0.5s ease forwards' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: '10px' }}>◎ NEW SCAN</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', marginBottom: '8px' }}>Upload Chest Image</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Supports X-ray and CT scan images. Accepts JPG, PNG, DICOM formats.</p>
        </div>

        {stage === -1 && !preview && (
          /* Drop zone */
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--teal)' : 'rgba(0,201,177,0.25)'}`,
              borderRadius: 'var(--radius-xl)', padding: '5rem 2rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.3s', textAlign: 'center',
              background: dragOver ? 'rgba(0,201,177,0.05)' : 'var(--card-bg)',
              backdropFilter: 'blur(20px)',
              animation: 'fade-in-up 0.5s 0.1s ease both',
            }}
          >
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', color: dragOver ? 'var(--teal)' : 'var(--muted)', transition: 'color 0.3s', animation: 'float 3s ease-in-out infinite' }}>
              ◎
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '8px' }}>
              {dragOver ? 'Drop to upload' : 'Drag & drop your scan here'}
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>or click to browse files</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['JPG', 'PNG', 'DICOM', 'WebP'].map(f => (
                <span key={f} style={{ background: 'rgba(0,201,177,0.08)', border: '1px solid rgba(0,201,177,0.2)', color: 'var(--teal)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Preview + controls */}
        {preview && stage < 5 && (
          <div style={{ animation: 'fade-in-up 0.5s ease forwards' }}>
            <div style={{
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)', overflow: 'hidden',
              backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow-card)',
            }}>
              {/* Image area */}
              <div style={{ position: 'relative', background: '#000', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={preview} alt="Uploaded scan" style={{ maxHeight: '380px', maxWidth: '100%', objectFit: 'contain', opacity: stage >= 0 ? 0.6 : 1, filter: stage >= 0 ? 'brightness(0.7) contrast(1.2)' : 'none', transition: 'all 0.5s' }} />
                {stage >= 0 && stage < 5 && (
                  <>
                    {/* Scanning overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,201,177,0.03) 2px, rgba(0,201,177,0.03) 4px)' }} />
                    <div style={{
                      position: 'absolute', left: 0, right: 0, height: 2,
                      background: 'linear-gradient(90deg, transparent, var(--teal), transparent)',
                      boxShadow: '0 0 20px var(--teal)',
                      animation: 'scan-line 2s linear infinite',
                    }} />
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ width: 60, height: 60, border: '2px solid var(--teal)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'rotate-slow 1s linear infinite', margin: '0 auto 12px' }} />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--teal)' }}>ANALYZING</div>
                    </div>
                  </>
                )}
                {/* File info badge */}
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(10,22,40,0.85)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', backdropFilter: 'blur(10px)' }}>
                  {file?.name}
                </div>
              </div>

              {/* Progress */}
              {stage >= 0 && (
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--teal)' }}>
                      {stage < STAGES.length ? STAGES[stage]?.label : 'Complete'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>{overallProgress}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', width: `${overallProgress}%`, background: 'linear-gradient(90deg, var(--teal), var(--cyan))', borderRadius: 3, transition: 'width 0.1s', boxShadow: '0 0 10px rgba(0,201,177,0.5)' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'rgba(139,163,199,0.5)' }}>
                    {stage < STAGES.length ? STAGES[stage]?.detail : ''}
                  </div>
                  {/* Stage dots */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                    {STAGES.map((s, i) => (
                      <div key={i} title={s.label} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: i < stage ? 'var(--teal)' : i === stage ? 'var(--cyan)' : 'rgba(255,255,255,0.08)',
                        transition: 'all 0.4s',
                        boxShadow: i === stage ? '0 0 8px var(--cyan)' : 'none',
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Action area */}
              {stage === -1 && (
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
                  <button onClick={() => { setFile(null); setPreview(null); }} style={{
                    flex: 1, padding: '13px', background: 'transparent',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
                    transition: 'all 0.2s',
                  }}>← Change Image</button>
                  <button onClick={runAnalysis} style={{
                    flex: 2, padding: '13px',
                    background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
                    border: 'none', borderRadius: 'var(--radius-sm)',
                    color: 'var(--navy)', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem',
                    boxShadow: '0 0 20px rgba(0,201,177,0.35)',
                    transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    ◎ Run AI Analysis
                  </button>
                </div>
              )}
            </div>

            {/* Info cards */}
            {stage === -1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.25rem' }}>
                {[
                  { icon: '⬡', label: 'Model', value: 'DenseNet-121' },
                  { icon: '◎', label: 'Classes', value: '14 diseases' },
                  { icon: '◈', label: 'Runtime', value: 'CPU-optimized' },
                ].map(info => (
                  <div key={info.label} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
                    <div style={{ color: 'var(--teal)', fontSize: '1.2rem', marginBottom: '6px' }}>{info.icon}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{info.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>{info.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: '1.5rem', padding: '1rem 1.25rem',
          background: 'rgba(255,200,87,0.05)', border: '1px solid rgba(255,200,87,0.15)',
          borderRadius: 'var(--radius-md)', fontSize: '0.78rem',
          color: 'rgba(255,200,87,0.7)', fontFamily: 'var(--font-mono)', lineHeight: 1.6,
        }}>
          ⚠ This AI system is a screening aid only. Results do not constitute a medical diagnosis. Always consult a licensed radiologist or physician.
        </div>
      </div>
    </div>
  );
}