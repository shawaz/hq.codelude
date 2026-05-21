'use client';

import { useState } from 'react';
import { ROUNDS } from '@/lib/fundraising';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  planning: { color: '#FAC775', label: 'Planning' },
  open:     { color: '#c8f53a', label: 'Open'     },
  closed:   { color: '#5DCAA5', label: 'Closed'   },
  paused:   { color: '#7a7870', label: 'Paused'   },
};

export default function RoundsPage() {
  const [selected, setSelected] = useState(ROUNDS[0].id);
  const round = ROUNDS.find(r => r.id === selected) ?? ROUNDS[0];
  const done = round.milestones.filter(m => m.done).length;
  const total = round.milestones.length;

  return (
    <div>
      <h1 className="page-title">Rounds</h1>
      <p className="page-sub">Fundraising round tracker — target, raised, milestones, and terms.</p>

      {/* Round selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {ROUNDS.map(r => (
          <button key={r.id} onClick={() => setSelected(r.id)} style={{
            flex: 1, padding: '0.8rem 0.5rem', background: selected === r.id ? r.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
            letterSpacing: '0.06em', color: selected === r.id ? 'var(--black)' : 'var(--muted)',
            fontWeight: selected === r.id ? 700 : 400, transition: 'all 0.15s',
          }}>{r.venture}</button>
        ))}
      </div>

      {/* Round header */}
      <div style={{ borderLeft: `2px solid ${round.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: round.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{round.type}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {round.name}
          <span className="status-badge" style={{ color: STATUS_STYLES[round.status].color, borderColor: `${STATUS_STYLES[round.status].color}40`, fontSize: '0.58rem' }}>{STATUS_STYLES[round.status].label}</span>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Target',       val: round.targetAmount,              color: round.color },
          { label: 'Raised',       val: round.raisedAmount,              color: round.raisedPct > 0 ? '#5DCAA5' : '#7a7870' },
          { label: 'Close target', val: round.closeTarget,               color: 'var(--off-white)' },
          { label: 'Investors',    val: round.investorCount === 0 ? 'None yet' : String(round.investorCount), color: round.investorCount > 0 ? '#5DCAA5' : '#7a7870' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: c.color, lineHeight: 1.2 }}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Milestones */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Milestones</span>
            <span style={{ color: 'var(--muted)' }}>{done}/{total} complete</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--card-border)', marginBottom: '1rem', borderRadius: 2 }}>
            <div style={{ height: '100%', background: round.color, width: `${Math.round((done / total) * 100)}%`, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {round.milestones.map((m, i) => (
              <div key={i} style={{ background: m.done ? '#0d1a12' : 'var(--card-bg)', padding: '0.8rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: m.done ? '#5DCAA5' : '#252522', flexShrink: 0, paddingTop: '0.05rem' }}>{m.done ? '✓' : '○'}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: m.done ? '#5DCAA5' : 'var(--muted)', lineHeight: 1.5, fontWeight: m.done ? 500 : 300 }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Terms + notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Instrument</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{round.instrumentNote}</p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Key terms</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{round.keyTerms}</p>
          </div>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Notes</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{round.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
