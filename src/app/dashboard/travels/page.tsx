'use client';

import { useState } from 'react';
import { TRIPS, type TripStatus } from '@/lib/workspace';

const STATUS_STYLES: Record<TripStatus, { color: string; label: string }> = {
  planned:     { color: '#FAC775', label: 'Planned'     },
  booked:      { color: '#c8f53a', label: 'Booked'      },
  'in-progress':{ color: '#5DCAA5', label: 'In Progress' },
  completed:   { color: '#7a7870', label: 'Completed'   },
  cancelled:   { color: '#ff8080', label: 'Cancelled'   },
};

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B',
};

export default function TravelsPage() {
  const [selected, setSelected] = useState<string | null>(TRIPS[0]?.id ?? null);
  const trip = TRIPS.find(t => t.id === selected);

  const totalBudget = trip ? trip.expenses.reduce((s, e) => s + e.budgeted, 0) : 0;
  const totalActual = trip ? trip.expenses.reduce((s, e) => s + e.actual, 0) : 0;

  return (
    <div>
      <h1 className="page-title">Travels</h1>
      <p className="page-sub">Business trip registry — objectives, itinerary, and expense tracking.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
        {/* Trip list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', alignSelf: 'start' }}>
          {TRIPS.map(t => {
            const ss = STATUS_STYLES[t.status];
            const isActive = selected === t.id;
            return (
              <div key={t.id} onClick={() => setSelected(t.id)}
                style={{ background: isActive ? '#131311' : 'var(--card-bg)', padding: '1rem 1.25rem', cursor: 'pointer',
                  borderLeft: isActive ? `2px solid ${VENTURE_COLORS[t.venture]}` : '2px solid transparent', transition: 'background 0.15s' }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>{t.destination}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{t.departure} → {t.return}</div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: VENTURE_COLORS[t.venture] }}>{t.venture}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.1rem 0.4rem', border: `1px solid ${ss.color}40`, color: ss.color }}>{ss.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trip detail */}
        {trip ? (
          <div>
            <div style={{ borderLeft: `2px solid ${VENTURE_COLORS[trip.venture]}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: VENTURE_COLORS[trip.venture], letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{trip.venture} — {trip.purpose}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{trip.destination}, {trip.country}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                {trip.departure} → {trip.return} · {trip.traveler}
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Objectives</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
              {trip.objectives.map((obj, i) => (
                <div key={i} style={{ background: 'var(--card-bg)', padding: '0.8rem 1.1rem', display: 'grid', gridTemplateColumns: '1.5rem 1fr', gap: '0.75rem', alignItems: 'start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', paddingTop: '0.05rem' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>{obj}</span>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Budget</div>
            <table className="tasks-table" style={{ marginBottom: '1rem' }}>
              <thead>
                <tr>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Budgeted</th>
                  <th style={{ textAlign: 'right' }}>Actual</th>
                  <th style={{ textAlign: 'right' }}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {trip.expenses.map((exp, i) => {
                  const variance = exp.actual - exp.budgeted;
                  return (
                    <tr key={i}>
                      <td><span className="category-label">{exp.category}</span></td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)' }}>${exp.budgeted}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: exp.actual === 0 ? 'var(--muted)' : 'var(--off-white)' }}>{exp.actual === 0 ? '—' : `$${exp.actual}`}</td>
                      <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: variance > 0 ? '#ff8080' : variance < 0 ? '#5DCAA5' : 'var(--muted)' }}>
                        {exp.actual === 0 ? '—' : variance === 0 ? '0' : `${variance > 0 ? '+' : ''}$${variance}`}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ background: 'rgba(255,255,255,0.03)', fontWeight: 600 }}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>Total</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)' }}>${totalBudget}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>{totalActual === 0 ? '—' : `$${totalActual}`}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>—</td>
                </tr>
              </tbody>
            </table>

            {trip.notes && (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Notes</div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>{trip.notes}</div>
              </>
            )}
          </div>
        ) : (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', padding: '2rem' }}>Select a trip to view details.</div>
        )}
      </div>
    </div>
  );
}
