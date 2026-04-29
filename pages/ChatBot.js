import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = [
  'What does pneumonia mean?',
  'Explain my scan results simply',
  'Is my result serious?',
  'What are the next steps?',
  'What is pleural effusion?',
  'When should I see a doctor?',
];

const SYSTEM_CONTEXT = `You are MediScan AI's patient assistant. You help patients understand chest X-ray and CT scan results in plain, compassionate language. 

Rules you MUST follow:
- NEVER provide a definitive medical diagnosis
- ALWAYS recommend consulting a licensed doctor for serious findings
- Keep explanations simple and jargon-free
- Be empathetic and reassuring, not alarming
- If confidence is high for a serious condition, strongly recommend medical consultation
- You can explain what conditions mean, symptoms, and general information
- Prefix medical terms with simple explanations`;

function buildPrompt(messages, scanResult) {
  let context = '';
  if (scanResult) {
    const topFindings = scanResult.findings.slice(0, 5).map(f => `${f.name}: ${Math.round(f.confidence * 100)}% confidence`).join(', ');
    context = `\nThe patient's scan shows these AI findings: ${topFindings}. Overall risk: ${scanResult.findings.filter(f => f.confidence > 0.5).length > 0 ? 'Moderate-High' : 'Low'}.\n`;
  }
  return `${SYSTEM_CONTEXT}${context}\n\n${messages.map(m => `${m.role === 'user' ? 'Patient' : 'Assistant'}: ${m.content}`).join('\n')}\nAssistant:`;
}

export default function ChatBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const scanResult = location.state?.result;
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hello ${user?.name?.split(' ')[0] || ''}! I'm your MediScan AI assistant. I can help explain chest scan findings in simple terms.${scanResult ? `\n\nI can see your recent scan results. Feel free to ask me what any finding means, or what you should do next.` : '\n\nYou can ask me about chest conditions, what scan findings mean, or upload a scan first to discuss specific results.'}\n\n⚠ Remember: I'm an AI assistant and cannot replace a real doctor's advice.`,
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;
    setInput('');
    const userMsg = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const allMsgs = [...messages, userMsg];
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_CONTEXT + (scanResult ? `\n\nThe patient's scan findings (AI-generated, not confirmed diagnosis): ${scanResult.findings.slice(0, 6).map(f => `${f.name}: ${Math.round(f.confidence * 100)}%`).join(', ')}.` : ''),
          messages: allMsgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. For medical questions, please consult your doctor directly.",
        timestamp: new Date(),
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ height: '100vh', paddingTop: '70px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', maxWidth: '900px', width: '100%', margin: '0 auto', padding: '1rem 1.5rem 0' }}>
        <div style={{ display: 'flex', width: '100%', gap: '1rem', overflow: 'hidden' }}>

          {/* Sidebar */}
          <div style={{ width: 240, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
            {/* Bot identity */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', backdropFilter: 'blur(20px)', textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', margin: '0 auto 10px',
                boxShadow: '0 0 20px rgba(0,201,177,0.3)', animation: 'pulse-ring 3s infinite',
              }}>◈</div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>MediScan AI</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green-safe)' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>Online</span>
              </div>
            </div>

            {/* Scan context */}
            {scanResult && (
              <div style={{ background: 'rgba(0,201,177,0.06)', border: '1px solid rgba(0,201,177,0.2)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--teal)', letterSpacing: '0.08em', marginBottom: '8px' }}>ACTIVE SCAN</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scanResult.filename}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{scanResult.findings.filter(f => f.confidence > 0.5).length} significant finding(s)</div>
              </div>
            )}

            {/* Suggestions */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', backdropFilter: 'blur(20px)' }}>
              <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '10px' }}>QUICK QUESTIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--offwhite)', padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-body)',
                    textAlign: 'left', transition: 'all 0.2s', lineHeight: 1.4,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,201,177,0.3)'; e.currentTarget.style.color = 'var(--teal)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--offwhite)'; }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {!scanResult && (
              <button onClick={() => navigate('/scan')} style={{
                background: 'linear-gradient(135deg, var(--teal), var(--cyan))',
                border: 'none', color: 'var(--navy)', padding: '12px',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem',
              }}>Upload a Scan →</button>
            )}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(20px)' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', animation: 'fade-in-up 0.3s ease forwards' }}>
                  {/* Avatar */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: msg.role === 'user' ? 'linear-gradient(135deg, var(--navy-light), var(--navy-mid))' : 'linear-gradient(135deg, var(--teal), var(--cyan))',
                    border: `1px solid ${msg.role === 'user' ? 'var(--border)' : 'rgba(0,201,177,0.4)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: msg.role === 'user' ? 'var(--muted)' : 'var(--navy)',
                  }}>
                    {msg.role === 'user' ? user?.name?.[0]?.toUpperCase() || 'U' : '◈'}
                  </div>
                  {/* Bubble */}
                  <div style={{ maxWidth: '75%' }}>
                    <div style={{
                      padding: '12px 16px',
                      background: msg.role === 'user' ? 'rgba(0,201,177,0.1)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${msg.role === 'user' ? 'rgba(0,201,177,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                      fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-wrap',
                      color: msg.role === 'user' ? 'var(--offwhite)' : 'var(--white)',
                    }}>
                      {msg.content}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(139,163,199,0.5)', marginTop: '4px', textAlign: msg.role === 'user' ? 'right' : 'left', fontFamily: 'var(--font-mono)' }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--navy)', fontWeight: 700 }}>◈</div>
                  <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 18px 18px 18px', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--teal)', animation: `dot-bounce 1.2s ${d}s infinite ease-in-out` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Disclaimer bar */}
            <div style={{ padding: '6px 16px', background: 'rgba(255,200,87,0.05)', borderTop: '1px solid rgba(255,200,87,0.12)', fontSize: '0.7rem', color: 'rgba(255,200,87,0.6)', fontFamily: 'var(--font-mono)' }}>
              ⚠ AI responses are informational only — not medical advice. Consult a doctor for clinical decisions.
            </div>

            {/* Input */}
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
              <input
                ref={inputRef} value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about your scan or chest conditions..."
                style={{
                  flex: 1, padding: '12px 16px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--white)',
                  fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--teal)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading} style={{
                padding: '12px 20px',
                background: input.trim() && !loading ? 'linear-gradient(135deg, var(--teal), var(--cyan))' : 'rgba(255,255,255,0.06)',
                border: 'none', borderRadius: 'var(--radius-sm)',
                color: input.trim() && !loading ? 'var(--navy)' : 'var(--muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s',
              }}>→</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}