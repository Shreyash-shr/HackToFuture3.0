import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function History() {
  const { scanHistory } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | positive | normal

  const filtered = scanHistory.filter(s => {
    const matchSearch = s.filename?.toLowerCase().includes(search.toLowerCase()) || new Date(s.date).toLocaleDateString().includes(search);
    const isPositive = s.findings?.some(f => f.confidence > 0.5);
    const matchFilter = filter === 'all' || (filter === 'positive' && isPositive) || (filter === 'normal' && !isPositive);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '4rem', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', animation: 'fade-in-up 0.5s ease forwards' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--teal)', letterSpacing: '0.1em', marginBottom: '8px' }}>◷ HISTORY</div>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.5rem', marginBottom: '6px' }}>Scan History</h1>
          <p style={{ color: 'var(--muted)' }}>{scanHistory.length} total scan{scanHistory.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', animation: 'fade-in-up 0.5s 0.1s ease both', flexWrap: 'wrap' }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by filename or date..."
            style={{
              flex: 1, minWidth: 200, padding: '10px 16px',
              background: 'var(--card-bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--white)',
              fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none',
              backdropFilter: 'blur(10px)', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--teal)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            {[['all', 'All'], ['positive', 'Findings'], ['normal', 'Normal']].map(([val, lbl]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                padding: '10px 18px', borderRadius: 'var(--radius-sm)',
                background: filter === val ? 'rgba(0,201,177,0.12)' : 'var(--card-bg)',
                border: `1px solid ${filter === val ? 'rgba(0,201,177,0.4)' : 'var(--border)'}`,
                color: filter === val ? 'var(--teal)' : 'var(--muted)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500,
                fontSize: '0.85rem', backdropFilter: 'blur(10px)', transition: 'all 0.2s',
              }}>{lbl}</button>
            ))}
          </div>
          <button onClick={() => navigate('/scan')} style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: 'var(--navy)', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem',
          }}>+ New Scan</button>
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)', padding: '5rem 2rem',
            backdropFilter: 'blur(20px)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '4rem', opacity: 0.2, marginBottom: '1rem' }}>◷</div>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: '8px' }}>
              {scanHistory.length === 0 ? 'No scans yet' : 'No results found'}
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>
              {scanHistory.length === 0 ? 'Upload your first chest scan to get started.' : 'Try a different search or filter.'}
            </p>
            {scanHistory.length === 0 && (
              <button onClick={() => navigate('/scan')} style={{
                background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
                border: 'none', color: 'var(--navy)', padding: '14px 32px',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 700,
              }}>Upload First Scan →</button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((scan, idx) => {
              const positive = scan.findings?.filter(f => f.confidence > 0.5) || [];
              const borderline = scan.findings?.filter(f => f.confidence >= 0.3 && f.confidence <= 0.5) || [];
              const hasFindings = positive.length > 0;
              const riskColor = hasFindings ? (positive.some(f => f.confidence > 0.75) ? 'var(--red-alert)' : 'var(--amber)') : 'var(--green-safe)';
              const riskLabel = hasFindings ? (positive.some(f => f.confidence > 0.75) ? 'High Risk' : 'Moderate') : 'Normal';

              return (
                <div key={scan.id || idx}
                  onClick={() => navigate('/results', { state: { result: scan } })}
                  style={{
                    background: 'var(--card-bg)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '1.25rem 1.5rem',
                    backdropFilter: 'blur(20px)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '1.25rem',
                    transition: 'all 0.25s',
                    animation: `fade-in-up 0.4s ${idx * 0.05}s ease both`,
                    borderLeftColor: riskColor, borderLeftWidth: 3,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.borderColor = `${riskColor}44`; e.currentTarget.style.borderLeftColor = riskColor; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.borderLeftColor = riskColor; }}
                >
                  {/* Thumbnail */}
                  <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-sm)', background: '#000', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {scan.imageData ? (
                      <img src={scan.imageData} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.1)' }} />
                    ) : (
                      <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>◎</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scan.filename || 'Scan'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {new Date(scan.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {scan.findings && (
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {scan.findings.filter(f => f.confidence > 0.4).slice(0, 3).map(f => (
                          <span key={f.name} style={{
                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: '100px',
                            fontFamily: 'var(--font-mono)',
                            background: f.confidence > 0.5 ? 'rgba(255,77,109,0.1)' : 'rgba(255,200,87,0.1)',
                            color: f.confidence > 0.5 ? 'var(--red-alert)' : 'var(--amber)',
                            border: `1px solid ${f.confidence > 0.5 ? 'rgba(255,77,109,0.25)' : 'rgba(255,200,87,0.25)'}`,
                          }}>{f.name} {Math.round(f.confidence * 100)}%</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Risk badge */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      background: `${riskColor}12`, border: `1px solid ${riskColor}30`,
                      color: riskColor, padding: '4px 12px', borderRadius: '100px',
                      fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: riskColor }} />
                      {riskLabel}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '4px' }}>
                      {scan.findings?.length || 0} checked
                    </div>
                  </div>

                  <span style={{ color: 'var(--muted)' }}>→</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}