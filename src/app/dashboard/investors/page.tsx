'use client';

import { useState } from 'react';
import { INVESTOR_ROUNDS, type RoundStatus, type RoundType } from '@/lib/finance';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<RoundStatus, { color: string; label: string }> = {
  planning:    { color: '#FAC775', label: 'Planning'    },
  seeking:     { color: '#F0997B', label: 'Seeking'     },
  negotiating: { color: '#c8f53a', label: 'Negotiating' },
  closed:      { color: '#5DCAA5', label: 'Closed'      },
  active:      { color: '#5DCAA5', label: 'Active'      },
};

const TYPE_COLORS: Record<RoundType, string> = {
  token:     '#c8f53a',
  equity:    '#7F77DD',
  bootstrap: '#85B7EB',
  grant:     '#5DCAA5',
  revenue:   '#F0997B',
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B',
};

export default function InvestorsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const round = selected ? INVESTOR_ROUNDS.find(r => r.id === selected) : null;

  return (
    <div>
      <h1 className="page-title">Investors</h1>
      <p className="page-sub">Fundraising rounds, token tranches, and investor allocation across all ventures.</p>

      {/* Token structure note */}
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Structure overview</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
          Codelude raises via a <strong style={{ color: 'var(--off-white)' }}>Dubai HoldCo token structure</strong>. Physical infrastructure assets (Roborns) are tokenised — token holders receive revenue share, not equity. The HoldCo studio token gives exposure across all five ventures. Equity rounds (Franchiseen, Llife) sit below the HoldCo and dilute at the project level only.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {INVESTOR_ROUNDS.map(r => {
            const ss = STATUS_STYLES[r.status];
            const isActive = selected === r.id;
            return (
              <div key={r.id} onClick={() => setSelected(isActive ? null : r.id)}
                style={{ background: isActive ? 'var(--card-bg-alt)' : 'var(--card-bg)', padding: '1.25rem 1.5rem', cursor: 'pointer', borderLeft: isActive ? `2px solid ${VENTURE_COLORS[r.venture]}` : '2px solid transparent', transition: 'background 0.15s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: sc(VENTURE_COLORS[r.venture]), letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{r.venture}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.roundName}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[r.type])}`, color: sc(TYPE_COLORS[r.type]) }}>{r.type}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color) }}>{ss.label}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Target</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{r.targetAmount}</div></div>
                  <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Raised</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: r.raisedAmount !== '$0' ? '#5DCAA5' : 'var(--muted)' }}>{r.raisedAmount}</div></div>
                  <div><div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Target close</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{r.targetClose}</div></div>
                </div>
              </div>
            );
          })}
        </div>

        {round && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: `2px solid ${VENTURE_COLORS[round.venture]}`, padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Structure</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{round.structure}</p>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Key terms</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{round.keyTerms}</p>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Lead investor</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{round.leadInvestor}</p>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Notes</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{round.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
