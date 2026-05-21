'use client';

import { useState, useRef, useEffect } from 'react';

const VENTURES = [
  {
    name: 'Roborns',     color: '#5DCAA5', sector: 'Coastal AI Infrastructure',
    status: 'In Development', statusColor: '#5DCAA5',
    headline: '₹18.1 Cr seed round — coastal AI + desalination plant, Mangaluru',
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
    headline: 'Fractional franchise ownership — daily payouts, retail investors',
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
- Break-even: Year 3 at ~$11M AUM
- Y5 revenue: $1.26M at 79% EBITDA

CURRENT STATUS:
- Platform architecture complete
- Payout architecture finalised
- KYC/AML provider selection pending
- No franchise brand partner yet
- Legal compliance (SEBI) not yet started

Help Shawaz make progress on Franchiseen.`,
  },
  {
    name: 'HubCV',       color: '#FAC775', sector: 'AI Career Intelligence',
    status: 'In Development', statusColor: '#5DCAA5',
    headline: 'AI + human verified dynamic career profiles for recruiters',
    metrics: [{ k: 'Stage', v: 'Build' }, { k: 'Beta', v: 'Q4 2026' }, { k: 'Y5 ARR', v: '$4.4M' }],
    context: `You are helping Shawaz work on HUBCV — an AI career intelligence platform with human + AI verified dynamic professional profiles.

KEY FACTS:
- Dynamic profiles updated continuously (not static resumes)
- Skills verified by domain experts + enriched by Anthropic Claude API
- B2B first: recruiters pay $99–299/month per seat
- Professionals pay $9–29/month premium
- Placement fee: 5% of first-year salary
- Stack: Next.js, NextAuth, Drizzle ORM (PostgreSQL), Anthropic SDK
- Code on server at /home/centos/codelude/hubcv/
- Needs: AI/ML engineer, 20 human skill verifiers, 5 recruiter design partners, beta cohort of 100 professionals
- Break-even: Year 3 at 150 recruiter accounts
- Y5 ARR: $4.4M

CURRENT STATUS:
- Matching engine in active development
- Dynamic profile system designed
- First bootcamp outreach sent (March 2026, follow-up pending)
- No recruiter partners yet
- No users yet

Help Shawaz make progress on HubCV.`,
  },
  {
    name: 'Cuestay',     color: '#85B7EB', sector: 'Home AI Automation',
    status: 'Planning', statusColor: '#FAC775',
    headline: 'Home that learns your routines and acts before you ask',
    metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Hub price', v: '$499' }, { k: 'MOQ', v: '$300K' }],
    context: `You are helping Shawaz work on CUESTAY — a home AI automation platform that learns household routines and acts proactively via a Matter-native hub device.

KEY FACTS:
- Works with all existing devices via Matter 1.3+ protocol (Apple HomeKit, Google Home, Amazon Alexa)
- AI learns routines + acts proactively — NOT just remote control
- Revenue: Hub hardware ($499, 35% margin) + AI subscription ($29/month, 85% margin)
- Hardware MOQ: $300K first production run
- B2B channel: property developer pre-installation agreements (zero CAC)
- Protocol spec complete (published April 2026)
- Stack: Next.js + Matter SDK + on-device AI + cloud fallback
- Needs: hardware manufacturing partner (ODM, Matter-certified), firmware engineer, hardware PM
- Break-even: Year 3 with 800 units + subscriptions
- Y5 revenue: $8.95M

CURRENT STATUS:
- Protocol specification published internally
- Hardware partner conversations started (3 ODMs contacted)
- No manufacturer signed yet
- No firmware development started

Help Shawaz make progress on Cuestay.`,
  },
  {
    name: 'Dextrip',     color: '#F0997B', sector: 'Decentralised Trading Automation',
    status: 'Live — Beta', statusColor: '#5DCAA5',
    headline: 'Non-custodial algo trading — 3 paying beta users, bots live',
    metrics: [{ k: 'MRR', v: '$227' }, { k: 'Subscribers', v: '3 beta' }, { k: 'Y5 ARR', v: '$7.1M' }],
    context: `You are helping Shawaz work on DEXTRIP — a non-custodial decentralised trading automation platform with a strategy marketplace.

KEY FACTS:
- Users keep their keys — Dextrip never holds funds
- Strategies: Every UP, Every DOWN, EMA Trend (fixed today — was only doing UP), RSI, Previous 2, Previous 4 (capped at 3 steps today)
- 3 paying beta subscribers: 2 × $99/month Pro, 1 × $29/month Base = $227 MRR
- Stack: Next.js, Python bots, Node.js execution engine
- Server: all bots on 64.227.160.224, PM2 managed
- Live domains: bot.dextrip.com (port 3000), tv.dextrip.com (3002), spot.dextrip.com (3003), client.dextrip.com (3006)
- Today's fixes: EMA Trend DOWN signal bug fixed (was checking pct > 0.01 instead of pct < -0.01). Previous 4 max_streak reduced to 3 (was reaching step 4-5 with -$115 losses).
- Entry mode: dual window — first 60s of event AND last 60s before next event
- Price filter: ask < $0.55
- Creator programme: 30% rev-share planned, 0 creators so far
- Y5 ARR: $7.1M at 90% EBITDA (pure SaaS)

CURRENT STATUS:
- Closed beta live, 3 paying users
- Multi-exchange connector in build (Binance active, Bybit in progress)
- Public beta target: Q3 2026
- Strategy marketplace planned for public beta

Help Shawaz work on Dextrip — trading strategy, bot fixes, growth, or anything else.`,
  },
];

interface Message { role: 'user' | 'assistant'; content: string; }

function VentureChat({ venture }: { venture: typeof VENTURES[0] }) {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    setMessages([]);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [venture.name]);

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
        body: JSON.stringify({
          messages: newMessages,
          systemOverride: venture.context,
        }),
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
          const u = [...prev];
          u[u.length - 1] = { role: 'assistant', content: reply };
          return u;
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

  const SUGGESTIONS: Record<string, string[]> = {
    Roborns:     ['What should I prioritise this week?', 'Draft an investor one-pager', 'Who should I contact first for the thermal engineering partner?', 'What permits do I need before construction?'],
    Franchiseen: ['Which KYC provider should I choose?', 'How do I find the first franchise brand partner?', 'Draft an outreach email to a franchise brand', 'What are the SEBI compliance steps?'],
    HubCV:       ['How do I get the first 5 recruiter design partners?', 'Draft outreach to a bootcamp for the verification programme', 'What should the matching engine prioritise?', 'How do I recruit human skill verifiers?'],
    Cuestay:     ['How do I evaluate ODM manufacturers?', 'What questions should I ask in the factory audit?', 'Draft a pitch to a Dubai property developer', 'What is the Matter certification process?'],
    Dextrip:     ['Why is EMA Trend performing this way?', 'How should I recruit the first strategy creators?', 'Draft a tweet for the public beta launch', 'What DeFi integrations should I prioritise?'],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
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
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.3rem 0.75rem', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.04em', textAlign: 'left' }}
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
      <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.6rem' }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Ask about ${venture.name}… (Enter to send)`}
          rows={1}
          style={{
            flex: 1, background: 'var(--black)', border: '1px solid var(--card-border)',
            color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
            padding: '0.6rem 0.85rem', outline: 'none', resize: 'none', lineHeight: 1.6,
            maxHeight: 96, overflowY: 'auto',
          }}
          onFocus={e => { e.target.style.borderColor = venture.color; }}
          onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          background: input.trim() && !loading ? venture.color : 'var(--card-border)',
          color: input.trim() && !loading ? 'var(--black)' : 'var(--muted)',
          border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700,
          padding: '0 1.25rem', transition: 'all 0.15s', flexShrink: 0,
        }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [selected, setSelected] = useState<number | null>(null);
  const venture = selected !== null ? VENTURES[selected] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)', minHeight: 0 }}>

      {/* Venture selector row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', flexShrink: 0 }}>
        {VENTURES.map((v, i) => (
          <button key={v.name} onClick={() => setSelected(i)} style={{
            background: selected === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer', padding: '1.1rem 0.75rem',
            textAlign: 'left', transition: 'background 0.15s',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: selected === i ? 'rgba(0,0,0,0.6)' : v.color, marginBottom: '0.3rem' }}>0{i + 1}</div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: selected === i ? 'var(--black)' : 'var(--off-white)', marginBottom: '0.2rem' }}>{v.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: selected === i ? 'rgba(0,0,0,0.55)' : 'var(--muted)', letterSpacing: '0.06em' }}>{v.sector}</div>
          </button>
        ))}
      </div>

      {/* Content area */}
      {venture === null ? (
        /* No venture selected — show prompt */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Select a venture above</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, textAlign: 'center', maxWidth: 420 }}>
            Choose one of the 5 ventures to open a focused AI chat. Claude has full context on each project — status, financials, stack, priorities, and open questions.
          </p>
          <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {VENTURES.map((v, i) => (
              <button key={v.name} onClick={() => setSelected(i)} style={{
                background: 'var(--card-bg)', border: 'none', cursor: 'pointer',
                padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1a1a18'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--card-bg)'; }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{v.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Venture selected — show header + chat */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, border: '1px solid var(--card-border)', borderTop: 'none' }}>
          {/* Venture header */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--card-border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '0.85rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: venture.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>{venture.sector}</div>
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{venture.name}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 300, flex: 1 }}>{venture.headline}</div>
            <div style={{ display: 'flex', gap: '1rem', flexShrink: 0 }}>
              {venture.metrics.map(m => (
                <div key={m.k} style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.1rem' }}>{m.k}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)', fontWeight: 600 }}>{m.v}</div>
                </div>
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', border: `1px solid ${venture.statusColor}40`, color: venture.statusColor, flexShrink: 0 }}>{venture.status}</span>
            {selected !== null && (
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', flexShrink: 0 }}>✕</button>
            )}
          </div>

          {/* Chat */}
          <VentureChat venture={venture} />
        </div>
      )}
    </div>
  );
}
