'use client';

import { useState } from 'react';
import { DECKS, OUTREACH_STYLES, type DeckStatus } from '@/lib/fundraising';

const STATUS_STYLES: Record<DeckStatus, { color: string; label: string }> = {
  final:  { color: '#5DCAA5', label: 'Final'  },
  draft:  { color: '#FAC775', label: 'Draft'  },
  review: { color: '#c8f53a', label: 'Review' },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

export default function DecksPage() {
  const [selected, setSelected] = useState<string | null>(DECKS[0].id);
  const deck = DECKS.find(d => d.id === selected);

  return (
    <div>
      <h1 className="page-title">Pitch Decks</h1>
      <p className="page-sub">Deck registry — versions, outreach log, and response tracking.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Deck list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {DECKS.map(d => {
            const ss = STATUS_STYLES[d.status];
            const isActive = selected === d.id;
            return (
              <div key={d.id} onClick={() => setSelected(isActive ? null : d.id)}
                style={{ background: isActive ? '#131311' : 'var(--card-bg)', padding: '1rem 1.25rem', cursor: 'pointer',
                  borderLeft: isActive ? `2px solid ${VENTURE_COLORS[d.venture]}` : '2px solid transparent', transition: 'background 0.12s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{d.name}</div>
                  <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, fontSize: '0.52rem' }}>{ss.label}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: VENTURE_COLORS[d.venture] }}>{d.venture}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>{d.version} · {d.slides} slides</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deck detail */}
        {deck ? (
          <div>
            <div style={{ borderLeft: `2px solid ${VENTURE_COLORS[deck.venture]}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: VENTURE_COLORS[deck.venture], letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{deck.venture} · {deck.version}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{deck.name}</div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.25rem' }}>
              {[
                { k: 'Status',   v: STATUS_STYLES[deck.status].label },
                { k: 'Version',  v: deck.version },
                { k: 'Slides',   v: `${deck.slides} slides` },
                { k: 'Updated',  v: deck.updated },
                { k: 'Location', v: deck.location },
              ].map(row => (
                <div key={row.k} style={{ background: 'var(--card-bg)', padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0 }}>{row.k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)', textAlign: 'right' }}>{row.v}</span>
                </div>
              ))}
            </div>

            {/* Purpose */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Purpose</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, margin: 0 }}>{deck.purpose}</p>
            </div>

            {/* Outreach log */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
              Outreach log ({deck.outreach.length})
            </div>
            {deck.outreach.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {deck.outreach.map((o, i) => {
                  const os = OUTREACH_STYLES[o.status];
                  return (
                    <div key={i} style={{ background: 'var(--card-bg)', padding: '0.9rem 1rem', display: 'grid', gridTemplateColumns: '1fr 90px 90px', gap: '1rem', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>{o.recipient}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{o.notes}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{o.date}</span>
                      <span className="status-badge" style={{ color: os.color, borderColor: `${os.color}40`, alignSelf: 'flex-start' }}>{os.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                Not yet sent externally.
              </div>
            )}
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', padding: '2rem' }}>Select a deck to view details.</div>
        )}
      </div>
    </div>
  );
}
