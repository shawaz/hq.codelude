'use client';

/**
 * Past days of assistant conversation, in the right rail beside Tasks.
 *
 * Each past day shows its summary; clicking expands the full transcript. The
 * summary is generated lazily — on mount this asks Convex whether any past day
 * is still unsummarised and, if so, kicks the summarise endpoint. Doing it on
 * next visit rather than on a schedule means there is no cron to operate, and
 * the summary is ready by the time anyone opens this panel.
 */

import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  color: 'var(--muted)',
};

/** "2026-08-30" → "Sat 30 Aug", with today/yesterday called out. */
function dayLabel(day: string, todayKey: string, yesterdayKey: string): string {
  if (day === todayKey) return 'Today';
  if (day === yesterdayKey) return 'Yesterday';
  const d = new Date(`${day}T00:00:00`);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const istDay = (ms: number) => new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);

/**
 * Fires the summarise endpoint for any past day still lacking a summary.
 *
 * Lives in a hook because the trigger belongs on the AI page itself — if it
 * only ran inside this panel, a day would stay unsummarised until someone
 * thought to open History, which is exactly when they want it already done.
 */
export function useLazySummarise(venture: string) {
  const pendingDay = useQuery(api.aichat.pendingSummary, { venture });
  const [summarising, setSummarising] = useState<string | null>(null);
  // Guards re-firing for a day already attempted: without it, a missing API
  // key would retry on every render forever.
  const attempted = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pendingDay || attempted.current.has(pendingDay)) return;
    attempted.current.add(pendingDay);
    setSummarising(pendingDay);
    fetch('/api/chat/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venture, day: pendingDay }),
    })
      .catch(() => { /* day stays pending; retried on next page load */ })
      .finally(() => setSummarising(null));
  }, [pendingDay, venture]);

  return summarising;
}

export default function ChatHistory({
  venture,
  accent,
}: {
  venture: string;
  accent: string;
}) {
  const history = useQuery(api.aichat.history, { venture, limit: 30 });
  const summarising = useLazySummarise(venture);
  const [openDay, setOpenDay] = useState<string | null>(null);

  const now = Date.now();
  const todayKey = istDay(now);
  const yesterdayKey = istDay(now - 86_400_000);

  if (history === undefined) {
    return <div style={{ ...mono, padding: '1.25rem 1rem' }}>Loading…</div>;
  }

  if (history.length === 0) {
    return (
      <div style={{ ...mono, padding: '1.25rem 1rem', lineHeight: 1.7 }}>
        No past conversations yet. Today&apos;s chat is summarised and filed here
        once the day rolls over.
      </div>
    );
  }

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {history.map(entry => (
        <DayEntry
          key={entry.day}
          venture={venture}
          accent={accent}
          day={entry.day}
          label={dayLabel(entry.day, todayKey, yesterdayKey)}
          messageCount={entry.messageCount}
          summary={entry.summary}
          summarising={summarising === entry.day}
          open={openDay === entry.day}
          onToggle={() => setOpenDay(openDay === entry.day ? null : entry.day)}
        />
      ))}
    </div>
  );
}

function DayEntry({
  venture, accent, day, label, messageCount, summary, summarising, open, onToggle,
}: {
  venture: string; accent: string; day: string; label: string;
  messageCount: number; summary: string | null; summarising: boolean;
  open: boolean; onToggle: () => void;
}) {
  // Only fetch a transcript once its day is actually expanded.
  const transcript = useQuery(
    api.aichat.dayMessages,
    open ? { venture, day } : 'skip',
  );

  return (
    <div style={{ borderBottom: '1px solid var(--card-border)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', background: 'none', border: 'none',
          cursor: 'pointer', padding: '0.7rem 1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span style={{ ...mono, color: accent, fontSize: '0.58rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {label}
          </span>
          <span style={{ ...mono, fontSize: '0.54rem', opacity: 0.7 }}>
            {messageCount} msg{messageCount === 1 ? '' : 's'}
          </span>
        </div>

        <div style={{ ...mono, color: 'var(--off-white)', lineHeight: 1.6, marginTop: '0.3rem', fontWeight: 300 }}>
          {summarising
            ? 'Summarising…'
            : summary
              ? (open ? summary : `${summary.slice(0, 140)}${summary.length > 140 ? '…' : ''}`)
              : 'Not summarised yet.'}
        </div>
      </button>

      {open && (
        <div style={{ padding: '0 1rem 0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ ...mono, fontSize: '0.52rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
            Transcript
          </div>
          {transcript === undefined ? (
            <div style={mono}>Loading…</div>
          ) : (
            transcript.map((m, i) => (
              <div key={i}>
                <div style={{ ...mono, fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: m.role === 'user' ? accent : 'var(--muted)' }}>
                  {m.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div style={{ ...mono, color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {m.content}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
