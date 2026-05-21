'use client';

import { useState, useRef, useEffect } from 'react';

const VENTURES = [
  { num: '01', name: 'Roborns',     sector: 'Coastal AI Infrastructure', color: '#5DCAA5', status: 'In Development', desc: 'Thermal engineering engaged. Site survey underway in Mangaluru.',         metrics: [{ k: 'Phase', v: '1 — Feasibility' }, { k: 'HoldCo', v: 'Dubai, UAE' }] },
  { num: '02', name: 'Franchiseen', sector: 'Franchise Finance OS',       color: '#7F77DD', status: 'Alpha',          desc: 'Platform architecture complete. First franchise partner onboarding.',   metrics: [{ k: 'Stage', v: 'Alpha' }, { k: 'Payout cycle', v: 'Q3 2026' }] },
  { num: '03', name: 'HubCV',       sector: 'AI Career Intelligence',     color: '#FAC775', status: 'In Development', desc: 'Matching engine in development. Recruiter outreach started.',           metrics: [{ k: 'Stage', v: 'Build' }, { k: 'Beta target', v: 'Q4 2026' }] },
  { num: '04', name: 'Cuestay',     sector: 'Home AI Automation',         color: '#85B7EB', status: 'Planning',       desc: 'Protocol spec complete. Hardware partner conversations underway.',      metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Launch', v: '2027' }] },
];

const ACTIVITY = [
  { date: 'May 21', text: 'EMA Trend DOWN signal bug fixed. Previous 4 capped at 3 steps.' },
  { date: 'May 20', text: 'Codelude.com launched and live.' },
  { date: 'May 20', text: 'hq.codelude.com deployed.' },
  { date: 'May 19', text: 'Franchiseen payout architecture finalized.' },
  { date: 'May 15', text: 'Roborns thermal feasibility study commissioned.' },
  { date: 'May 10', text: 'HubCV matching engine development started.' },
];

interface Message { role: 'user' | 'assistant'; content: string; }

function AIChat() {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: reply };
          return updated;
        });
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 480, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderTop: '2px solid var(--accent)' }}>
      {/* Header */}
      <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Claude — Codelude Assistant</span>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em' }}>
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollbarWidth: 'none' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>
              Ask anything about the 5 ventures, fundraising, trading strategy, or the business. I have full context on Codelude.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
              {[
                'How is Dextrip performing today?',
                'What should I prioritise for Roborns this week?',
                'Draft an investor update for the seed round',
                'What is the status of all 5 ventures?',
              ].map(s => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.3rem 0.7rem', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--off-white)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--muted)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%', padding: '0.75rem 1rem',
              background: m.role === 'user' ? 'rgba(200,245,58,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${m.role === 'user' ? 'rgba(200,245,58,0.2)' : 'var(--card-border)'}`,
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)',
              lineHeight: 1.8, fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {m.content || (loading && i === messages.length - 1 ? <span style={{ color: 'var(--muted)' }}>▌</span> : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1, background: 'var(--black)', border: '1px solid var(--card-border)',
            color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            padding: '0.6rem 0.85rem', outline: 'none', resize: 'none', lineHeight: 1.6,
            maxHeight: 96, overflowY: 'auto',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          background: input.trim() && !loading ? 'var(--accent)' : 'var(--card-border)',
          color: input.trim() && !loading ? 'var(--black)' : 'var(--muted)',
          border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
          padding: '0 1.25rem', transition: 'all 0.15s', letterSpacing: '0.06em', flexShrink: 0,
        }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <div className="stats-row">
        <div className="stat-box"><div className="stat-box-num">4</div><div className="stat-box-label">Active ventures</div></div>
        <div className="stat-box"><div className="stat-box-num">1</div><div className="stat-box-label">Team members</div></div>
        <div className="stat-box"><div className="stat-box-num">DXB</div><div className="stat-box-label">HoldCo domicile</div></div>
        <div className="stat-box"><div className="stat-box-num hi">Live</div><div className="stat-box-label">codelude.com</div></div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div>
          <div className="section-label">Ventures</div>
          <div className="venture-cards">
            {VENTURES.map(v => (
              <div key={v.num} className="vc" style={{ borderLeft: `2px solid ${v.color}` }}>
                <div className="vc-top">
                  <div>
                    <div className="vc-num">{v.num} / {v.name.toUpperCase()}</div>
                    <div className="vc-name">{v.name}</div>
                    <div className="vc-sector">{v.sector}</div>
                  </div>
                  <div className="vc-status" style={{ color: v.color }}>{v.status}</div>
                </div>
                <p className="vc-desc">{v.desc}</p>
                <div className="vc-metrics">
                  {v.metrics.map(m => (
                    <div key={m.k} className="vc-metric">
                      <span className="vc-metric-key">{m.k}</span>
                      <span className="vc-metric-val">{m.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-label">Activity</div>
          <div className="activity-list">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-date">{a.date}</span>
                <span className="activity-text">{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div className="section-label">Ask Claude</div>
      <AIChat />
    </div>
  );
}
