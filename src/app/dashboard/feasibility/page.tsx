'use client';

import { useState } from 'react';
import VentureTabs, { VentureEmpty } from '@/components/VentureTabs';
import { sc } from '@/lib/status-colors';
import {
  programmeFor, stageCost, programmeCost, decisionCost, rupees, lakh,
  type ItemKind,
} from '@/lib/feasibility';

const mono = (size: string) => ({ fontFamily: 'var(--font-mono)', fontSize: size });

/** Blocking is the only kind that gets a colour — it is the walk-away signal. */
const KIND_LABEL: Record<ItemKind, string | null> = {
  blocking: 'Blocking',
  value: 'Value',
  standard: null,
};

export default function FeasibilityPage() {
  const [venture, setVenture] = useState('Roborns');
  const p = programmeFor(venture);

  return (
    <div>
      <h1 className="page-title">Feasibility</h1>
      <p className="page-sub">
        Staged site diligence — ordered by what can kill a site soonest and cheapest, not by
        engineering sequence.
      </p>

      <VentureTabs active={venture} onChange={setVenture} />

      {!p && <VentureEmpty what="feasibility programme" venture={venture} />}

      {p && (() => {
        const total    = programmeCost(p);
        const decision = decisionCost(p);
        return (
          <>
            {/* Site header */}
            <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ ...mono('0.6rem'), color: 'var(--accent-text)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                {p.location}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{p.site}</div>
            </div>

            {/* Site facts */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
              {p.facts.map(f => (
                <div key={f.label} style={{ background: 'var(--card-bg)', padding: '0.85rem 1rem' }}>
                  <div style={{ ...mono('0.55rem'), color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{f.label}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.1 }}>{f.value}</div>
                  {f.sub && <div style={{ ...mono('0.6rem'), color: 'var(--muted)', marginTop: '0.25rem', fontWeight: 300 }}>{f.sub}</div>}
                </div>
              ))}
            </div>

            {/* Headline costs */}
            <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '2rem' }}>
              <div className="tasks-count-cell">
                <div className="tasks-count-num" style={{ color: sc('#dbdbdb') }}>{lakh(decision.min, decision.max)}</div>
                <div className="tasks-count-label">Go / no-go decision</div>
              </div>
              <div className="tasks-count-cell">
                <div className="tasks-count-num">{lakh(total.min, total.max)}</div>
                <div className="tasks-count-label">Full programme</div>
              </div>
              <div className="tasks-count-cell">
                <div className="tasks-count-num" style={{ color: sc('#9d9d9d') }}>
                  {p.stages.flatMap(s => s.items).filter(i => i.kind === 'blocking').length}
                </div>
                <div className="tasks-count-label">Blocking items</div>
              </div>
            </div>

            {/* Stages */}
            {p.stages.map(s => {
              const c = stageCost(s);
              return (
                <div key={s.stage} style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.9rem', flexWrap: 'wrap', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
                    <span style={{ ...mono('0.6rem'), fontWeight: 600, letterSpacing: '0.1em', background: 'var(--off-white)', color: 'var(--black)', padding: '0.15rem 0.45rem' }}>
                      STAGE {s.stage}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, flex: 1, minWidth: '10ch' }}>{s.title}</span>
                    <span style={{ ...mono('0.75rem'), fontWeight: 600, color: c.max === 0 ? sc('#dbdbdb') : 'var(--accent-text)' }}>
                      {c.max === 0 ? 'Free' : rupees(c.min, c.max)}
                    </span>
                  </div>
                  <p style={{ ...mono('0.68rem'), color: 'var(--muted)', fontWeight: 300, lineHeight: 1.75, margin: '0 0 0.9rem', maxWidth: '78ch' }}>{s.summary}</p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                    {s.items.map(i => (
                      <div key={i.ref} style={{
                        background: 'var(--card-bg)', padding: '0.9rem 1.2rem',
                        display: 'grid', gridTemplateColumns: '3rem 1fr 11rem 9rem', gap: '1rem',
                        alignItems: 'start',
                        borderLeft: i.kind === 'blocking' ? '2px solid var(--off-white)' : '2px solid transparent',
                      }}>
                        <div style={{ ...mono('0.68rem'), color: 'var(--muted)' }}>{i.ref}</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.45 }}>
                            {i.action}
                            {KIND_LABEL[i.kind] && (
                              <span style={{
                                ...mono('0.52rem'), letterSpacing: '0.13em', textTransform: 'uppercase',
                                fontWeight: 600, padding: '0.08rem 0.35rem', marginLeft: '0.5rem',
                                border: '1px solid currentColor', verticalAlign: '0.12em',
                                color: i.kind === 'blocking' ? 'var(--off-white)' : 'var(--muted)',
                              }}>{KIND_LABEL[i.kind]}</span>
                            )}
                          </div>
                          {i.detail && (
                            <div style={{ ...mono('0.65rem'), color: 'var(--muted)', fontWeight: 300, lineHeight: 1.7, marginTop: '0.35rem' }}>{i.detail}</div>
                          )}
                        </div>
                        <div style={{ ...mono('0.68rem'), color: 'var(--muted)' }}>{i.who}</div>
                        <div style={{ ...mono('0.72rem'), fontWeight: 500, textAlign: 'right', color: i.costMax === 0 ? sc('#dbdbdb') : 'var(--off-white)' }}>
                          {rupees(i.costMin, i.costMax)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Critical path */}
            <div style={{ marginBottom: '2rem' }}>
              <div className="section-label">What ends this, in order</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {p.risks.map(r => (
                  <div key={r.rank} style={{ background: 'var(--card-bg)', padding: '1rem 1.2rem', display: 'grid', gridTemplateColumns: '2.5rem 10rem 1fr', gap: '1rem', alignItems: 'start' }}>
                    <div style={{ ...mono('0.68rem'), fontWeight: 600, color: 'var(--accent-text)' }}>{r.rank}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{r.title}</div>
                    <div style={{ ...mono('0.68rem'), color: 'var(--muted)', fontWeight: 300, lineHeight: 1.75 }}>{r.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {p.artifactUrl && (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1.1rem 1.35rem' }}>
                <div style={{ ...mono('0.58rem'), color: 'var(--accent-text)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Shareable copy</div>
                <p style={{ ...mono('0.68rem'), color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8, margin: '0 0 0.6rem', maxWidth: '74ch' }}>
                  The same programme as a standalone page, for sending to consultants, the CA, or an
                  investor who should see the diligence rather than a valuation.
                </p>
                <a href={p.artifactUrl} target="_blank" rel="noopener noreferrer"
                   style={{ ...mono('0.68rem'), color: 'var(--off-white)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                  Panambur Site Diligence ↗
                </a>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}
