'use client';

import { useState, useMemo } from 'react';
import { EVENTS, type EventType, type EventStatus } from '@/lib/workspace';
import { usePageScopes } from '@/lib/use-page-scopes';

const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B',
};

const STATUS_STYLES: Record<EventStatus, { color: string; label: string }> = {
  today:     { color: '#c8f53a', label: 'Today'     },
  upcoming:  { color: '#5DCAA5', label: 'Upcoming'  },
  completed: { color: 'var(--muted)', label: 'Completed' },
  cancelled: { color: '#ff8080', label: 'Cancelled' },
};

const TYPE_COLORS: Record<EventType, string> = {
  Meeting:     '#7F77DD', Call: '#85B7EB', 'Site Visit': '#5DCAA5',
  Legal:       '#F0997B', Milestone: '#c8f53a', Deadline: '#ff8080',
  Launch:      '#5DCAA5', Travel: '#FAC775',
};

const TYPES: (EventType | 'all')[] = ['all', 'Meeting', 'Call', 'Site Visit', 'Legal', 'Milestone', 'Deadline', 'Launch', 'Travel'];
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function pad(n: number) { return String(n).padStart(2, '0'); }

function calendarDays(year: number, month: number): (number | null)[] {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const total    = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function dateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export default function EventsPage() {
  const now    = new Date();
  const { names: allowed } = usePageScopes('events');
  const VENTURES = ['All', ...allowed];
  const [view,    setView]    = useState<'list' | 'calendar'>('calendar');
  const [venture, setVenture] = useState('All');
  const [type,    setType]    = useState<EventType | 'all'>('all');
  const [calYear,  setCalYear]  = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const filtered = useMemo(() => EVENTS
    .filter(e =>
      allowed.includes(e.venture) &&
      (venture === 'All' || e.venture === venture) &&
      (type === 'all'  || e.type    === type)
    )
    .sort((a, b) => a.date.localeCompare(b.date)),
    [allowed, venture, type]
  );

  // Build a date→events map for the calendar
  const byDate = useMemo(() => {
    const map: Record<string, typeof EVENTS> = {};
    EVENTS.forEach(e => { (map[e.date] ??= []).push(e); });
    return map;
  }, []);

  const days = useMemo(() => calendarDays(calYear, calMonth), [calYear, calMonth]);

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
    setSelected(null);
  }

  const selectedEvents = selected ? (byDate[selected] ?? []) : [];

  return (
    <div>
      <h1 className="page-title">Events</h1>
      <p className="page-sub">Company calendar — meetings, calls, site visits, milestones, and deadlines.</p>

      {/* View toggle */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {(['calendar', 'list'] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: '0.55rem 1.4rem', border: '1px solid', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
            background: view === v ? 'var(--off-white)' : 'transparent',
            borderColor: view === v ? 'var(--off-white)' : 'var(--card-border)',
            color: view === v ? 'var(--black)' : 'var(--muted)',
          }}>{v === 'calendar' ? '⊞ Calendar' : '≡ List'}</button>
        ))}
      </div>

      {/* ── CALENDAR VIEW ─────────────────────────────────────────────── */}
      {view === 'calendar' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
          <div>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <button onClick={prevMonth} style={{ background: 'none', border: '1px solid var(--card-border)', color: 'var(--muted)', cursor: 'pointer', padding: '0.4rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--off-white)'; }} onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--muted)'; }}>←</button>
              <div style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>{MONTHS[calMonth]} {calYear}</div>
              <button onClick={nextMonth} style={{ background: 'none', border: '1px solid var(--card-border)', color: 'var(--muted)', cursor: 'pointer', padding: '0.4rem 0.9rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--off-white)'; }} onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--muted)'; }}>→</button>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
              {/* Headers */}
              {WEEK_DAYS.map(d => (
                <div key={d} style={{ background: 'var(--card-bg)', padding: '0.6rem 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{d}</div>
              ))}

              {/* Cells */}
              {days.map((day, i) => {
                if (!day) return <div key={i} style={{ background: 'var(--black)', minHeight: 80 }} />;
                const ds = dateStr(calYear, calMonth, day);
                const events = byDate[ds] ?? [];
                const isToday = ds === today;
                const isSelected = ds === selected;
                const hasEvents = events.length > 0;

                return (
                  <div key={i} onClick={() => hasEvents && setSelected(isSelected ? null : ds)}
                    style={{
                      background: isSelected ? '#1a1a18' : isToday ? 'var(--card-bg-alt)' : 'var(--card-bg)',
                      minHeight: 72, padding: '0.5rem 0.5rem 0.4rem',
                      cursor: hasEvents ? 'pointer' : 'default',
                      borderTop: isSelected ? '2px solid var(--accent)' : isToday ? '2px solid rgba(200,245,58,0.3)' : '2px solid transparent',
                      transition: 'background 0.12s',
                    }}>
                    {/* Day number */}
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: isToday ? 700 : 400,
                      color: isToday ? 'var(--accent)' : hasEvents ? 'var(--off-white)' : 'var(--muted)',
                      marginBottom: '0.4rem',
                    }}>{day}</div>

                    {/* Dots only — no text */}
                    {hasEvents && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center' }}>
                        {events.slice(0, 5).map((e, j) => (
                          <span key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: VENTURE_COLORS[e.venture], flexShrink: 0, display: 'inline-block' }} />
                        ))}
                        {events.length > 5 && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: 'var(--muted)' }}>+{events.length - 5}</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Venture legend */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {Object.entries(VENTURE_COLORS).map(([v, c]) => (
                <span key={v} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />{v}
                </span>
              ))}
            </div>
          </div>

          {/* Selected day panel */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            {selected && selectedEvents.length > 0 ? (
              <>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-text)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>
                  {selected}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                  {selectedEvents.map((e, i) => {
                    const ss = STATUS_STYLES[e.status];
                    return (
                      <div key={i} style={{ background: 'var(--card-bg)', padding: '1rem 1.1rem', borderLeft: `2px solid ${VENTURE_COLORS[e.venture]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', padding: '0.12rem 0.4rem', border: `1px solid ${TYPE_COLORS[e.type]}40`, color: TYPE_COLORS[e.type] }}>{e.type}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: ss.color }}>{ss.label}</span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>{e.title}</div>
                        {e.time && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{e.time} · {e.location}</div>}
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{e.notes}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                {selected ? 'No events on this date.' : 'Click a date with events to see details.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LIST VIEW ─────────────────────────────────────────────────── */}
      {view === 'list' && (
        <>
          <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total',     val: EVENTS.length,                                          color: 'var(--off-white)' },
              { label: 'Today',     val: EVENTS.filter(e => e.status === 'today').length,        color: '#c8f53a' },
              { label: 'Upcoming',  val: EVENTS.filter(e => e.status === 'upcoming').length,     color: '#5DCAA5' },
              { label: 'Completed', val: EVENTS.filter(e => e.status === 'completed').length,    color: 'var(--muted)' },
            ].map(c => (
              <div key={c.label} className="tasks-count-cell">
                <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
                <div className="tasks-count-label">{c.label}</div>
              </div>
            ))}
          </div>

          <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
            {VENTURES.map(v => <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`} style={venture === v && v !== 'All' ? { borderColor: VENTURE_COLORS[v], color: VENTURE_COLORS[v] } : {}} onClick={() => setVenture(v)}>{v}</button>)}
          </div>
          <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
            {TYPES.map(t => <button key={t} className={`filter-pill${type === t ? ' active' : ''}`} style={type === t && t !== 'all' ? { borderColor: TYPE_COLORS[t as EventType], color: TYPE_COLORS[t as EventType] } : {}} onClick={() => setType(t)}>{t === 'all' ? 'All types' : t}</button>)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {filtered.map(e => {
              const ss = STATUS_STYLES[e.status];
              const isOpen = expanded === e.id;
              return (
                <div key={e.id} onClick={() => setExpanded(isOpen ? null : e.id)}
                  style={{ background: e.status === 'today' ? 'var(--card-bg-alt)' : 'var(--card-bg)', cursor: 'pointer', borderLeft: e.status === 'today' ? '2px solid var(--accent)' : '2px solid transparent' }}>
                  <div style={{ padding: '1rem 1.5rem', display: 'grid', gridTemplateColumns: '130px 100px 100px 1fr auto', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)', fontWeight: e.status === 'today' ? 600 : 400 }}>{e.date}</div>
                      {e.time && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{e.time}</div>}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[e.type]}40`, color: TYPE_COLORS[e.type], alignSelf: 'center' }}>{e.type}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: VENTURE_COLORS[e.venture] }}>{e.venture}</span>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: e.status === 'completed' ? 'var(--muted)' : 'var(--off-white)' }}>{e.title}</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${ss.color}40`, color: ss.color, whiteSpace: 'nowrap' }}>{ss.label}</span>
                  </div>
                  {isOpen && (
                    <div style={{ padding: '0 1.5rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} onClick={ev => ev.stopPropagation()}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Notes</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{e.notes}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Location</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)' }}>{e.location}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && <div style={{ background: 'var(--card-bg)', padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>No events match the current filter.</div>}
          </div>
        </>
      )}
    </div>
  );
}
