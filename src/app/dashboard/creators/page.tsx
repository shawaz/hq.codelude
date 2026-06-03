'use client';

import { useState } from 'react';

type CreatorStatus = 'live' | 'onboarding' | 'prospecting' | 'declined';

interface Creator {
  id:          string;
  name:        string;
  handle:      string;
  platform:    string;
  status:      CreatorStatus;
  strategies:  number;
  subscribers: number;
  revShare:    number;   // USD owed this month
  community:   string;
  notes:       string;
  joined:      string;
}

const CREATORS: Creator[] = [
  {
    id: 'C001', name: 'Beta User #2 (TBD)', handle: '@trader', platform: 'Dextrip',
    status: 'prospecting', strategies: 0, subscribers: 0, revShare: 0,
    community: 'Direct beta user', joined: '—',
    notes: 'Strong engagement on closed beta. Has expressed interest in creator programme. Follow-up scheduled. Potential first creator.',
  },
  {
    id: 'C002', name: 'Quant Twitter Creator (TBD)', handle: 'TBD', platform: 'Twitter/X',
    status: 'prospecting', strategies: 0, subscribers: 0, revShare: 0,
    community: 'Crypto Twitter', joined: '—',
    notes: 'Target: quant/algo traders with 1K+ followers who already share strategy insights. Approach with marketplace + 30% rev-share pitch.',
  },
];

const STATUS_STYLES: Record<CreatorStatus, { color: string; label: string }> = {
  live:        { color: '#5DCAA5', label: 'Live'        },
  onboarding:  { color: '#c8f53a', label: 'Onboarding'  },
  prospecting: { color: '#FAC775', label: 'Prospecting' },
  declined:    { color: '#7a7870', label: 'Declined'    },
};

const PROGRAMME_TERMS = [
  { label: 'Revenue share',      val: '30% of subscriber revenue attributed to their strategies' },
  { label: 'Strategy visibility',val: 'Creator profile page, strategy stats public to all subscribers' },
  { label: 'Co-marketing',       val: 'Dextrip features creator in launch comms and social posts' },
  { label: 'Early access',       val: 'Institutional API tier access + beta features before public release' },
  { label: 'Payout cadence',     val: 'Monthly — via Stripe or crypto (USDT)' },
  { label: 'Min strategy track', val: '90-day live track record required before marketplace listing' },
];

const PIPELINE_METRICS = [
  { label: 'Target creators (pre-beta)', val: '20', color: '#FAC775', sub: 'before public launch Q3 2026' },
  { label: 'Current in programme',      val: '0',  color: '#7a7870', sub: 'none recruited yet' },
  { label: 'Prospecting',               val: String(CREATORS.filter(c => c.status === 'prospecting').length), color: '#c8f53a', sub: 'warm leads identified' },
  { label: 'MRR rev-share owed',        val: '$0', color: '#5DCAA5', sub: 'no live creators yet' },
];

export default function CreatorsPage() {
  const [tab, setTab] = useState<'pipeline' | 'programme'>('pipeline');

  return (
    <div>
      <h1 className="page-title">Creator Programme</h1>
      <p className="page-sub">Strategy creator pipeline — recruitment, onboarding, and revenue share tracking.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {PIPELINE_METRICS.map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: c.color, marginBottom: '0.15rem', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {([['pipeline', 'Creator Pipeline'], ['programme', 'Programme Terms']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: '0.55rem 1.3rem', border: '1px solid', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
            background: tab === key ? 'var(--off-white)' : 'transparent',
            borderColor: tab === key ? 'var(--off-white)' : 'var(--card-border)',
            color: tab === key ? 'var(--black)' : 'var(--muted)',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'pipeline' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
            {CREATORS.map(c => {
              const ss = STATUS_STYLES[c.status];
              return (
                <div key={c.id} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', borderLeft: `2px solid ${ss.color}40` }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 90px', gap: '1rem', alignItems: 'start', marginBottom: '0.6rem' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{c.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{c.handle} · {c.platform}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Source</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--off-white)' }}>{c.community}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Rev share</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: c.revShare > 0 ? '#5DCAA5' : 'var(--muted)' }}>{c.revShare > 0 ? `$${c.revShare}/mo` : '—'}</div>
                    </div>
                    <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, alignSelf: 'flex-start' }}>{ss.label}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{c.notes}</div>
                </div>
              );
            })}
          </div>

          {/* Outreach targets */}
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Outreach plan</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>
              Target: 20 creators recruited before public beta (July 2026). Focus on quant Twitter community — traders who already share signals, strategies, or analysis. Reach out with: marketplace invite, 30% rev-share, co-marketing on launch.<br/><br/>
              <strong style={{ color: 'var(--off-white)' }}>Priority sources:</strong> Crypto Twitter algo/quant community · TradingView script authors · dYdX/GMX community strategy sharers · Telegram trading groups
            </p>
          </div>
        </>
      )}

      {tab === 'programme' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {PROGRAMME_TERMS.map((t, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>{t.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>{t.val}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid #F0997B', padding: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#F0997B', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Why creators grow Dextrip</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>
              Every creator is a distribution channel. When a creator publishes a strategy, their community subscribes — zero acquisition cost for Dextrip. 30% rev-share means creators earn more as their community grows, creating a flywheel: better creators attract more subscribers, more subscribers attract more creators.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
