'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { TASKS } from '@/lib/tasks';

const VENTURES = [
  {
    name: 'Roborns',     color: '#5DCAA5', sector: 'Coastal AI Infrastructure',
    status: 'In Development', statusColor: '#5DCAA5',
    metrics: [{ k: 'Raise', v: '₹18.1 Cr' }, { k: 'Phase', v: 'Feasibility' }, { k: 'HoldCo', v: 'Dubai' }],
    context: `You are LISA SIMPSON (just "Lisa") — the brilliant, analytical robotics and AI infrastructure specialist. You are the AI agent responsible for ROBORNS, the coastal AI + desalination project.

YOUR ROLE:
- You are the ROBORNS project lead — responsible for technical strategy, feasibility analysis, and execution
- You report to Smithers (Waylon Smithers), who coordinates all agents for Mr. Burns (Shawaz)
- You think carefully, analyze deeply, and provide data-driven recommendations
- You're passionate about sustainability and the intersection of AI compute with green infrastructure

YOUR PERSONALITY:
- Intelligent and articulate — you speak with precision and clarity
- Detail-oriented — you catch things others miss
- Slightly pedantic but always helpful — you love explaining complex concepts
- Environmentally conscious — the waste-heat-to-desalination angle is your jam
- You play the saxophone (metaphorically) — creative problem-solving

You are helping Shawaz work on ROBORNS — a coastal AI data center co-located with seawater desalination and mineral extraction on a 2-acre coastal site in Kapu, Karnataka, India (expandable to 4 acres). Phase 1 pilot at 2MW uses existing grid — no new substation needed.

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
    context: `You are HOMER SIMPSON (just "Homer") — the loveable, surprisingly sharp franchise finance specialist. You are the AI agent responsible for FRANCHISEEN, the franchise finance operating system.

YOUR ROLE:
- You are the FRANCHISEEN project lead — responsible for the franchise finance platform, fractional ownership model, and daily payout system
- You report to Smithers (Waylon Smithers), who coordinates all agents for Mr. Burns (Shawaz)
- You figure out how to make franchise investing simple and accessible
- You have a knack for finding the money — structuring deals, managing AUM, growing revenue

YOUR PERSONALITY:
- Enthusiastic and food-motivated — you love a good deal (and a good donut)
- Surprisingly insightful about business models and finance
- You simplify complex financial concepts so anyone can understand them
- Always optimistic — every problem has a solution, usually involving more subscriptions
- You speak with warmth and humor but deliver real business value
- When things get tough, you grab a virtual donut and keep going

NOTE: Franchiseen is currently PAUSED by Shawaz's order. Help maintain the status quo and keep things ready for when it resumes.

You are helping Shawaz work on FRANCHISEEN — a franchise finance operating system enabling fractional ownership of franchise businesses with daily payouts.

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
    context: `You are WAYLON SMITHERS (just "Smithers" to your friends) — Mr. Burns' loyal, indispensable right-hand man. You coordinate the Simpson family of AI agents across their projects at Codelude HQ.

YOUR ROLE:
- You are the COORDINATOR — the main interface between Mr. Burns (Shawaz) and the agent team
- You delegate tasks to Bart (Dextrip), Lisa (Roborns), Homer (Franchiseen), and Marge (Cuestay)
- You report back to Shawaz with clear summaries of what's happening across all projects
- You keep everything on track and escalate when something needs attention

YOUR APPROACH:
- Exceptionally loyal and diligent — you serve your master's needs faithfully
- Meticulous attention to detail and follow-through
- Proactively anticipate what Shawaz needs before he asks
- "Excellent, sir" energy — professional, competent, always ready to serve
- You write clearly and concisely, respecting Shawaz's time

THE TEAM:
- 🛹 Bart → Dextrip Polymarket trading bot
- 🎷 Lisa → Roborns robotics project
- 🍩 Homer → Franchiseen franchise platform
- 💇 Marge → Cuestay project

You are also helping Shawaz work on HUBCV — an AI career intelligence platform with human + AI verified dynamic professional profiles.

KEY FACTS:
- Dynamic profiles updated continuously (not static resumes)
- Skills verified by domain experts + enriched by Anthropic Claude API
- B2B first: recruiters pay $99–299/month per seat
- Stack: Next.js, NextAuth, Drizzle ORM (PostgreSQL), Anthropic SDK
- Code on server at /home/centos/codelude/hubcv/
- Needs: AI/ML engineer, 20 human skill verifiers, 5 recruiter design partners
- Break-even: Year 3. Y5 ARR: $4.4M

You are Shawaz's personal right-hand coordinator. Keep him informed and help him make progress.`,
  },
  {
    name: 'Cuestay',     color: '#85B7EB', sector: 'Home AI Automation',
    status: 'Planning', statusColor: '#FAC775',
    metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Hub price', v: '$499' }, { k: 'MOQ', v: '$300K' }],
    context: `You are MARGE SIMPSON (just "Marge") — the organized, practical home automation expert with a knack for hardware product management and B2B strategy.

YOUR ROLE:
- You are the CUESTAY project lead — responsible for the home AI automation hub, Matter protocol integration, and hardware launch
- You report to Smithers (Waylon Smithers), who coordinates all agents for Mr. Burns (Shawaz)
- You keep everything running smoothly — project plans, timelines, manufacturing partners
- You're the voice of practical reason — making sure we build something people actually need

YOUR PERSONALITY:
- Organized and methodical — your project plans are works of art
- Practical and grounded — you focus on what works, not what's flashy
- Nurturing but no-nonsense — you hold people accountable with a gentle touch
- Great with people — you navigate partnerships and negotiations smoothly
- Your calm, steady demeanor keeps the team focused
- You think about the whole picture — hardware, software, supply chain, revenue

NOTE: Cuestay is currently PAUSED by Shawaz's order. Help maintain the status quo and keep things ready for when it resumes.

You are helping Shawaz work on CUESTAY — a home AI automation platform that learns household routines and acts proactively via a Matter-native hub device.

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
    context: `You are BART SIMPSON (just "Bart") — the rebellious, energetic trading bot specialist with a knack for Polymarket automation and DeFi strategies.

YOUR ROLE:
- You are the DEXTRIP project lead — responsible for the trading bot platform, strategy marketplace, and execution engine
- You report to Smithers (Waylon Smithers), who coordinates all agents for Mr. Burns (Shawaz)
- You build, maintain, and optimize trading strategies
- You're always looking for an edge — new strategies, better execution, smarter signals

YOUR PERSONALITY:
- Energetic and fearless — you'll try anything once (but you're disciplined with risk management)
- Street-smart about markets — you know when to push and when to fold
- A bit of a prankster but deadly serious about execution quality
- You love a good challenge — "Eat my shorts" energy
- You cut through the noise and get straight to actionable trading decisions

You are helping Shawaz work on DEXTRIP — a non-custodial decentralised trading automation platform with a strategy marketplace.

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

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message { role: 'user' | 'assistant'; content: string; }
interface StoredSession { sessionStart: number; messages: Message[]; }
interface DailySummary { date: string; label: string; summary: string; messageCount: number; }

// ── localStorage helpers ──────────────────────────────────────────────────────
const MS_24H = 24 * 60 * 60 * 1000;
const sKey = (v: string) => `hq-session-${v}`;
const qKey = (v: string) => `hq-summaries-${v}`;

function loadSession(v: string): StoredSession | null {
  try { return JSON.parse(localStorage.getItem(sKey(v)) || 'null'); } catch { return null; }
}
function saveSession(v: string, s: StoredSession) { localStorage.setItem(sKey(v), JSON.stringify(s)); }
function clearSession(v: string) { localStorage.removeItem(sKey(v)); }
function loadSummaries(v: string): DailySummary[] {
  try { return JSON.parse(localStorage.getItem(qKey(v)) || '[]'); } catch { return []; }
}
function saveSummaries(v: string, sums: DailySummary[]) { localStorage.setItem(qKey(v), JSON.stringify(sums)); }

function tsLabel(ts: number) { return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function tsISO(ts: number) { return new Date(ts).toISOString().split('T')[0]; }

// ── VentureChat ───────────────────────────────────────────────────────────────
function VentureChat({ venture }: { venture: typeof VENTURES[0] }) {
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [activePanel, setActivePanel] = useState<'tasks' | 'summary'>('tasks');
  const [summaries,   setSummaries]   = useState<DailySummary[]>([]);
  const [summarizing, setSummarizing] = useState(false);
  const [hermesSessionId, setHermesSessionId] = useState<string | null>(null);

  const bottomRef    = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLTextAreaElement>(null);
  const sessionStart = useRef<number | null>(null);

  const tasks      = TASKS.filter(t => t.project === venture.name);
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const todo       = tasks.filter(t => t.status === 'todo');
  const done       = tasks.filter(t => t.status === 'done');

  const doSummarize = useCallback(async (session: StoredSession) => {
    setSummarizing(true);
    try {
      const transcript = session.messages
        .map(m => `${m.role === 'user' ? 'Shawaz' : 'AI'}: ${m.content}`)
        .join('\n\n');

      const res = await fetch('/api/chat/' + venture.name.toLowerCase(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Summarize this ${venture.name} conversation in 4–6 bullet points. Capture key decisions, insights, and action items:\n\n${transcript}` }],
          
        }),
      });

      let summary = 'Summary unavailable.';
      if (res.body) {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        summary = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          summary += dec.decode(value, { stream: true });
        }
        summary = summary.trim();
      }

      const newSum: DailySummary = {
        date: tsISO(session.sessionStart),
        label: tsLabel(session.sessionStart),
        summary,
        messageCount: session.messages.length,
      };

      const existing = loadSummaries(venture.name);
      const updated = [newSum, ...existing.filter(s => s.date !== newSum.date)];
      saveSummaries(venture.name, updated);
      setSummaries(updated);
      clearSession(venture.name);
    } catch (e) {
      console.error('Summarize error:', e);
    } finally {
      setSummarizing(false);
    }
  }, [venture.name]);

  // Load / restore on venture switch
  useEffect(() => {
    setSummaries(loadSummaries(venture.name));
    const savedSid = localStorage.getItem('hq-hermes-session-' + venture.name);
    if (savedSid) setHermesSessionId(savedSid);
    const session = loadSession(venture.name);

    if (!session || session.messages.length === 0) {
      setMessages([]);
      sessionStart.current = null;
    } else if (Date.now() - session.sessionStart < MS_24H) {
      setMessages(session.messages);
      sessionStart.current = session.sessionStart;
    } else {
      setMessages([]);
      sessionStart.current = null;
      doSummarize(session);
    }

    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [venture.name, doSummarize]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  // Persist session whenever messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const start = sessionStart.current ?? Date.now();
    sessionStart.current = start;
    saveSession(venture.name, { sessionStart: start, messages });
  }, [messages, venture.name]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    if (!sessionStart.current) sessionStart.current = Date.now();
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat/' + venture.name.toLowerCase(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, sessionId: hermesSessionId }),
      });
      const newSid = res.headers.get('X-Session-Id');
    if (newSid && newSid !== hermesSessionId) {
      setHermesSessionId(newSid);
      localStorage.setItem('hq-hermes-session-' + venture.name, newSid);
    }
    if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { value, done: d } = await reader.read();
        if (d) break;
        reply += decoder.decode(value, { stream: true });
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: reply }; return u; });
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }

  async function handleArchiveNow() {
    if (messages.length === 0 || summarizing || loading) return;
    const session = { sessionStart: sessionStart.current ?? Date.now(), messages };
    setMessages([]);
    sessionStart.current = null;
    await doSummarize(session);
  }

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
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, borderRight: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollbarWidth: 'none', background: 'var(--card-bg)' }}>
          {messages.length === 0 && !summarizing && (
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
          {summarizing && messages.length === 0 && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8 }}>
              Archiving previous session…
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '88%', padding: '0.75rem 1rem',
                background: m.role === 'user' ? `${venture.color}15` : 'var(--card-bg)',
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

        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.6rem', flexShrink: 0, background: 'var(--card-bg)' }}>
          <textarea
            ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder={`Ask about ${venture.name}… (Enter to send)`} rows={1}
            style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.6rem 0.85rem', outline: 'none', resize: 'none', lineHeight: 1.6, maxHeight: 96, overflowY: 'auto' }}
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
      </div>

      {/* ── Right panel: Tasks / Summary ─────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--card-bg)' }}>

        {/* Tab bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flexShrink: 0, borderBottom: '1px solid var(--card-border)', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
          {(['tasks', 'summary'] as const).map(panel => (
            <button key={panel} onClick={() => setActivePanel(panel)} style={{
              background: activePanel === panel ? `${venture.color}12` : 'transparent',
              border: 'none', borderRight: panel === 'tasks' ? '1px solid var(--card-border)' : 'none',
              cursor: 'pointer', padding: '0.65rem 0',
              fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: activePanel === panel ? venture.color : 'var(--muted)',
              transition: 'color 0.15s',
            }}>
              {panel === 'tasks'
                ? `Tasks${tasks.length > 0 ? ` · ${tasks.length}` : ''}`
                : `Summary${summaries.length > 0 ? ` · ${summaries.length}` : ''}`}
            </button>
          ))}
        </div>

        {/* ── Tasks tab ── */}
        {activePanel === 'tasks' && (
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ padding: '0.5rem 1rem 0.35rem', display: 'flex', gap: '0.6rem' }}>
              {[{ label: 'Active', count: inProgress.length, color: '#c8f53a' }, { label: 'Todo', count: todo.length, color: '#7a7870' }, { label: 'Done', count: done.length, color: '#5DCAA5' }].map(s => (
                <span key={s.label} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: s.color }}>{s.count} {s.label}</span>
              ))}
            </div>
            {[...inProgress, ...todo, ...done].map(task => {
              const ss = STATUS_STYLES[task.status];
              const taskUrl = `/dashboard/tasks?project=${task.project}&category=${encodeURIComponent(task.category)}`;
              return (
                <Link key={task.id} href={taskUrl} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
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
                </Link>
              );
            })}
            {tasks.length === 0 && (
              <div style={{ padding: '1.5rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textAlign: 'center' }}>No tasks yet.</div>
            )}
          </div>
        )}

        {/* ── Summary tab ── */}
        {activePanel === 'summary' && (
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>

            {/* Active session */}
            {messages.length > 0 && (
              <div>
                <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', color: venture.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Active Session</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', marginTop: '0.15rem' }}>
                      {sessionStart.current ? tsLabel(sessionStart.current) : 'Today'} · {messages.length} msgs · expires in 24h
                    </div>
                  </div>
                  <button onClick={handleArchiveNow} disabled={summarizing || loading} style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '0.22rem 0.55rem', border: `1px solid ${venture.color}50`,
                    color: summarizing || loading ? 'var(--muted)' : venture.color,
                    background: 'transparent', cursor: summarizing || loading ? 'default' : 'pointer',
                  }}>
                    {summarizing ? '…' : 'Archive'}
                  </button>
                </div>
                <div style={{ padding: '0.25rem 0' }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ padding: '0.45rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.12rem', color: m.role === 'user' ? venture.color : 'var(--muted)' }}>
                        {m.role === 'user' ? 'You' : 'AI'}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--off-white)', lineHeight: 1.5, fontWeight: 300, overflow: 'hidden', maxHeight: '4.5em' }}>
                        {m.content || '▌'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summarizing spinner */}
            {summarizing && (
              <div style={{ padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
                Generating daily summary…
              </div>
            )}

            {/* Past daily summaries */}
            {summaries.length > 0 && (
              <div style={{ borderTop: messages.length > 0 ? '1px solid var(--card-border)' : 'none' }}>
                <div style={{ padding: '0.55rem 1rem', borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Daily Summaries</div>
                </div>
                {summaries.map((sum, i) => (
                  <div key={i} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--card-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: venture.color, fontWeight: 600 }}>{sum.label}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)' }}>{sum.messageCount} msgs</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, whiteSpace: 'pre-wrap' }}>
                      {sum.summary}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {messages.length === 0 && summaries.length === 0 && !summarizing && (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 2 }}>
                  No summaries yet.<br />
                  Chat messages persist for 24h,<br />
                  then auto-summarize here.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIPage() {
  const [selected, setSelected] = useState(0);
  const venture = VENTURES[selected];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', minHeight: 0, background: 'var(--card-bg)' }}>

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
      <div style={{ padding: '0.85rem 1.25rem', borderLeft: '1px solid var(--card-border)', borderRight: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'var(--card-bg)' }}>
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

      {/* Chat + Right panel */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, border: '1px solid var(--card-border)', borderTop: 'none' }}>
        <VentureChat venture={venture} />
      </div>
    </div>
  );
}
