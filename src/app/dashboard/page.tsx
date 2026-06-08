'use client';

import { useState, useRef, useEffect } from 'react';
import { TASKS } from '@/lib/tasks';

const VENTURES = [
  {
    name: 'Roborns',     color: '#5DCAA5', sector: 'Coastal AI Infrastructure',
    status: 'In Development', statusColor: '#5DCAA5',
    metrics: [{ k: 'Raise', v: '₹18.1 Cr' }, { k: 'Phase', v: 'Feasibility' }, { k: 'HoldCo', v: 'Dubai' }],
    context: `You are helping Shawaz work on ROBORNS — a coastal AI data center co-located with seawater desalination and mineral extraction on a 1-acre coastal site in Uchila Thalapady, Mangaluru, India.

KEY FACTS:
- Waste heat from AI compute drives MED seawater desalination (50K L/day pilot)
- Brine byproduct feeds mineral extraction (salt, Mg, bromine)
- Tokenised via Dubai HoldCo — token = revenue share, not equity
- Phase 1 seed: ₹18.1 Cr (~$2.1M) for Buildings A (compute) + B (desalination) + thermal loop
- Series A: ₹65–80 Cr for Building C (minerals) post pilot
- Y5 revenue: ₹142 Cr at 80% EBITDA margin
- Pre-money valuation: ₹60 Cr. Seed investor return target: 18–23×
- Fundraising via India equity (CCDs — Compulsorily Convertible Debentures)
- Needs: thermal engineering partner, site survey, govt permits (CRZ, MESCOM), anchor compute tenant LOI

CURRENT STATUS:
- Financial model published (HQ)
- Thermal feasibility study commissioned May 2026
- Site survey planned June 2026
- Dubai HoldCo incorporation in progress
- India entity (Roborns Energy & Infrastructure Pvt. Ltd.) to be incorporated

Help Shawaz make progress on Roborns. Be a sharp technical and business advisor.`,
  },
  {
    name: 'Franchiseen', color: '#7F77DD', sector: 'Franchise Finance OS',
    status: 'Alpha', statusColor: '#c8f53a',
    metrics: [{ k: 'Stage', v: 'Alpha' }, { k: 'Payout', v: 'Daily + monthly' }, { k: 'Target AUM', v: '$60M Y5' }],
    context: `You are helping Shawaz work on FRANCHISEEN — a franchise finance operating system enabling fractional ownership of franchise businesses with daily payouts.

KEY FACTS:
- Retail investors buy fractional stakes in franchise businesses from $100
- Daily + monthly revenue distributions to investors
- Franchise operators get capital without bank debt
- Platform fee: 1.5% of deals + 0.5% AUM management fee
- Stack: Next.js, Crossmint, Solana/Jupiter, Convex
- Code on server at /home/centos/codelude/franchiseen/software/client/
- Needs: KYC/AML provider (Onfido/Signzy), payment processor, SEBI compliance, first franchise brand partner
- Break-even: Year 3 at ~$11M AUM. Y5 revenue: $1.26M at 79% EBITDA

Help Shawaz make progress on Franchiseen.`,
  },
  {
    name: 'HubCV',       color: '#FAC775', sector: 'AI Career Intelligence',
    status: 'In Development', statusColor: '#5DCAA5',
    metrics: [{ k: 'Stage', v: 'Build' }, { k: 'Beta', v: 'Q4 2026' }, { k: 'Y5 ARR', v: '$4.4M' }],
    context: `You are helping Shawaz work on HUBCV — an AI career intelligence platform with human + AI verified dynamic professional profiles.

KEY FACTS:
- Dynamic profiles updated continuously (not static resumes)
- Skills verified by domain experts + enriched by Anthropic Claude API
- B2B first: recruiters pay $99–299/month per seat
- Stack: Next.js, NextAuth, Drizzle ORM (PostgreSQL), Anthropic SDK
- Code on server at /home/centos/codelude/hubcv/
- Needs: AI/ML engineer, 20 human skill verifiers, 5 recruiter design partners
- Break-even: Year 3. Y5 ARR: $4.4M

Help Shawaz make progress on HubCV.`,
  },
  {
    name: 'Cuestay',     color: '#85B7EB', sector: 'Home AI Automation',
    status: 'Planning', statusColor: '#FAC775',
    metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Hub price', v: '$499' }, { k: 'MOQ', v: '$300K' }],
    context: `You are helping Shawaz work on CUESTAY — a home AI automation platform that learns household routines and acts proactively via a Matter-native hub device.

KEY FACTS:
- Works with all existing devices via Matter 1.3+ protocol
- AI learns routines + acts proactively — NOT just remote control
- Revenue: Hub hardware ($499, 35% margin) + AI subscription ($29/month, 85% margin)
- Hardware MOQ: $300K first production run
- B2B channel: property developer pre-installation agreements
- Protocol spec complete (published April 2026)
- Needs: hardware manufacturing partner (ODM), firmware engineer, hardware PM
- Y5 revenue: $8.95M

Help Shawaz make progress on Cuestay.`,
  },
  {
    name: 'Dextrip',     color: '#F0997B', sector: 'Decentralised Trading Automation',
    status: 'Live — Beta', statusColor: '#5DCAA5',
    metrics: [{ k: 'MRR', v: '$227' }, { k: 'Subscribers', v: '3 beta' }, { k: 'Y5 ARR', v: '$7.1M' }],
    context: `You are helping Shawaz work on DEXTRIP — a non-custodial decentralised trading automation platform with a strategy marketplace.

KEY FACTS:
- Users keep their keys — Dextrip never holds funds
- Strategies: Every UP, Every DOWN, EMA Trend (fixed today — was only doing UP), RSI, Previous 2, Previous 4 (capped at 3 steps today)
- 3 paying beta subscribers: 2 × $99/month Pro, 1 × $29/month Base = $227 MRR
- Stack: Next.js, Python bots, Node.js execution engine
- Server: all bots on 64.227.160.224, PM2 managed
- Today's fixes: EMA Trend DOWN signal bug fixed. Previous 4 max_streak reduced to 3.
- Entry mode: dual window — first 60s of event AND last 60s before next event
- Price filter: ask < $0.55
- Y5 ARR: $7.1M at 90% EBITDA (pure SaaS)

Help Shawaz work on Dextrip.`,
  },
];

const PRIORITY_COLOR: Record<string, string> = { high: '#ff8080', medium: '#FAC775', low: '#7a7870' };
const STATUS_STYLES: Record<string, { color: string; dot: string }> = {
  'done':        { color: '#5DCAA5', dot: '✓' },
  'in-progress': { color: '#c8f53a', dot: '●' },
  'todo':        { color: '#7a7870', dot: '○' },
};

type AIModel = 'claude' | 'deepseek';

interface Message { role: 'user' | 'assistant'; content: string; }

function VentureChat({ venture }: { venture: typeof VENTURES[0] }) {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [model,     setModel]     = useState<AIModel>('claude');
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const tasks       = TASKS.filter(t => t.project === venture.name);
  const inProgress  = tasks.filter(t => t.status === 'in-progress');
  const todo        = tasks.filter(t => t.status === 'todo');
  const done        = tasks.filter(t => t.status === 'done');

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { setMessages([]); setInput(''); setTimeout(() => inputRef.current?.focus(), 100); }, [venture.name]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, systemOverride: venture.context, model }),
      });
      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader(); const decoder = new TextDecoder(); let reply = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { value, done: d } = await reader.read();
        if (d) break;
        reply += decoder.decode(value, { stream: true });
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: reply }; return u; });
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  }

  function handleKey(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  const SUGGESTIONS: Record<string, string[]> = {
    Roborns:     ['What should I prioritise this week?', 'Draft an investor one-pager', 'Who should I contact first for thermal engineering?', 'What permits do I need before construction?'],
    Franchiseen: ['Which KYC provider should I choose?', 'How do I find the first franchise brand partner?', 'Draft an outreach email to a franchise brand', 'What are the SEBI compliance steps?'],
    HubCV:       ['How do I get the first 5 recruiter design partners?', 'Draft outreach to a bootcamp', 'What should the matching engine prioritise?', 'How do I recruit human skill verifiers?'],
    Cuestay:     ['How do I evaluate ODM manufacturers?', 'Draft a pitch to a Dubai property developer', 'What is the Matter certification process?', 'How should I fund the hardware MOQ?'],
    Dextrip:     ['Why is EMA Trend performing this way?', 'How should I recruit the first strategy creators?', 'Draft a tweet for the public beta launch', 'What DeFi integrations should I prioritise?'],
  };

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, gap: 0 }}>

      {/* ── Chat panel ──────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, borderRight: '1px solid var(--card-border)' }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollbarWidth: 'none' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>
                I have full context on {venture.name}. Ask anything — strategy, next steps, drafts, analysis.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {(SUGGESTIONS[venture.name] ?? []).map(s => (
                  <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.3rem 0.75rem', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--off-white)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--muted)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '88%', padding: '0.75rem 1rem',
                background: m.role === 'user' ? `${venture.color}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${m.role === 'user' ? `${venture.color}30` : 'var(--card-border)'}`,
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)',
                lineHeight: 1.85, fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              }}>
                {m.content || (loading && i === messages.length - 1 ? <span style={{ color: 'var(--muted)' }}>▌</span> : '')}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <textarea
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
              placeholder={`Ask about ${venture.name}… (Enter to send)`} rows={1}
              style={{ flex: 1, background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.6rem 0.85rem', outline: 'none', resize: 'none', lineHeight: 1.6, maxHeight: 96, overflowY: 'auto' }}
              onFocus={e => { e.target.style.borderColor = venture.color; }}
              onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; }}
            />
            <button onClick={send} disabled={loading || !input.trim()} style={{
              background: input.trim() && !loading ? venture.color : 'var(--card-border)', color: input.trim() && !loading ? 'var(--black)' : 'var(--muted)',
              border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, padding: '0 1.25rem', transition: 'all 0.15s', flexShrink: 0,
            }}>
              {loading ? '...' : 'Send'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {(['claude', 'deepseek'] as AIModel[]).map(m => (
              <button key={m} onClick={() => setModel(m)} style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '0.2rem 0.65rem', border: `1px solid ${model === m ? venture.color : 'var(--card-border)'}`,
                background: model === m ? `${venture.color}18` : 'transparent',
                color: model === m ? venture.color : 'var(--muted)', cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {m === 'claude' ? 'Claude Sonnet' : 'DeepSeek Flash'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tasks panel ─────────────────────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--card-border)', flexShrink: 0, position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: venture.color, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Tasks — {tasks.length} total
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.3rem' }}>
            {[{ label: 'Active', count: inProgress.length, color: '#c8f53a' }, { label: 'Todo', count: todo.length, color: '#7a7870' }, { label: 'Done', count: done.length, color: '#5DCAA5' }].map(s => (
              <span key={s.label} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: s.color }}>{s.count} {s.label}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, padding: '0.5rem 0' }}>
          {/* In progress first */}
          {[...inProgress, ...todo, ...done].map(task => {
            const ss = STATUS_STYLES[task.status];
            return (
              <div key={task.id} style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: ss.color, fontSize: '0.6rem', marginTop: '0.12rem', flexShrink: 0 }}>{ss.dot}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: task.status === 'done' ? 'var(--muted)' : 'var(--off-white)', lineHeight: 1.4, fontWeight: 300, textDecoration: task.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.title}
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)' }}>· {task.category}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {tasks.length === 0 && (
            <div style={{ padding: '1.5rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textAlign: 'center' }}>No tasks yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIPage() {
  const [selected, setSelected] = useState(0);   // Roborns by default
  const venture = VENTURES[selected];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', minHeight: 0 }}>

      {/* Venture selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', flexShrink: 0 }}>
        {VENTURES.map((v, i) => (
          <button key={v.name} onClick={() => setSelected(i)} style={{
            background: selected === i ? v.color : 'var(--card-bg)', border: 'none', cursor: 'pointer',
            padding: '1rem 0.75rem', textAlign: 'left', transition: 'background 0.15s',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: selected === i ? 'rgba(0,0,0,0.55)' : v.color, marginBottom: '0.25rem' }}>0{i + 1}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: selected === i ? 'var(--black)' : 'var(--off-white)', marginBottom: '0.15rem' }}>{v.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: selected === i ? 'rgba(0,0,0,0.5)' : 'var(--muted)', letterSpacing: '0.04em' }}>{v.sector}</div>
          </button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ padding: '0.85rem 1.25rem', borderLeft: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{venture.sector}</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{venture.name}</div>
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', marginLeft: 'auto' }}>
          {venture.metrics.map(m => (
            <div key={m.k} style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{m.k}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', fontWeight: 600 }}>{m.v}</div>
            </div>
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.18rem 0.55rem', border: `1px solid ${venture.statusColor}40`, color: venture.statusColor, flexShrink: 0 }}>{venture.status}</span>
      </div>

      {/* Chat + Tasks */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, border: '1px solid var(--card-border)', borderTop: 'none' }}>
        <VentureChat venture={venture} />
      </div>
    </div>
  );
}
