'use client';

/**
 * Raise plan attachments for one venture, on Finance → Planning.
 *
 * The Planning page's structured sections only exist for Roborns. This is how
 * the other four ventures get a plan on the record — the deck, model or memo
 * as it already exists, uploaded rather than re-typed.
 *
 * Bytes go to Convex storage via the three-step handshake; see planDocs.ts.
 */

import { useRef, useState, type FormEvent } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

/** 20MB. Convex storage takes more, but a raise deck over this is a mistake. */
const MAX_BYTES = 20 * 1024 * 1024;

const ACCEPT = '.pdf,.xlsx,.xls,.docx,.doc,.pptx,.ppt,.csv,.md,.txt';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Extension as a short label, e.g. "raise-plan.xlsx" → "XLSX". */
function formatExt(name: string): string {
  const ext = name.split('.').pop();
  return ext && ext.length <= 5 ? ext.toUpperCase() : 'FILE';
}

export default function PlanDocuments({ venture, accent }: { venture: string; accent: string }) {
  const docs           = useQuery(api.planDocs.list, { venture });
  const getUploadUrl   = useMutation(api.planDocs.generateUploadUrl);
  const createDoc      = useMutation(api.planDocs.create);
  const removeDoc      = useMutation(api.planDocs.remove);

  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || busy) return;

    if (file.size > MAX_BYTES) {
      setError(`${file.name} is ${formatSize(file.size)} — the limit is ${formatSize(MAX_BYTES)}.`);
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const url = await getUploadUrl();
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': file.type || 'application/octet-stream' },
        body: file,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const { storageId } = await res.json();

      await createDoc({
        venture,
        name: file.name,
        storageId: storageId as Id<'_storage'>,
        size: file.size,
        contentType: file.type || undefined,
        note: noteRef.current?.value.trim() || undefined,
      });

      // Clear only on success — a failed upload should leave the picked file
      // in place so it can be retried without re-selecting it.
      if (fileRef.current) fileRef.current.value = '';
      if (noteRef.current) noteRef.current.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  const rows = docs ?? [];

  return (
    <div>
      {/* ── Upload ───────────────────────────────────────────────────────── */}
      <form
        onSubmit={submit}
        style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderLeft: `2px solid ${accent}`, padding: '1.25rem', marginBottom: '1.5rem',
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '1 1 260px', minWidth: 0 }}>
          <label htmlFor={`plan-file-${venture}`} style={labelStyle}>Plan document</label>
          <input
            id={`plan-file-${venture}`} ref={fileRef} type="file" accept={ACCEPT} required
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: '2 1 320px', minWidth: 0 }}>
          <label htmlFor={`plan-note-${venture}`} style={labelStyle}>Note (optional)</label>
          <input
            id={`plan-note-${venture}`} ref={noteRef} type="text"
            placeholder="e.g. Seed deck v3 — sent to Gulf family offices"
            style={{
              background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem', padding: '0.5rem 0.7rem', outline: 'none',
            }}
          />
        </div>

        <button
          type="submit" disabled={busy}
          style={{
            background: busy ? 'var(--card-border)' : accent,
            color: busy ? 'var(--muted)' : 'var(--on-brand)',
            border: 'none', cursor: busy ? 'default' : 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '0.6rem 1.4rem', transition: 'all 0.15s', flexShrink: 0,
          }}
        >{busy ? 'Uploading…' : 'Upload'}</button>

        <div style={{ flexBasis: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          PDF, Excel, Word, PowerPoint, CSV or Markdown · up to {formatSize(MAX_BYTES)}
        </div>

        {error && (
          <div role="alert" style={{ flexBasis: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--st-red)', lineHeight: 1.6 }}>
            {error}
          </div>
        )}
      </form>

      {/* ── Uploaded documents ───────────────────────────────────────────── */}
      {docs === undefined ? null : rows.length === 0 ? (
        <div style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8,
        }}>
          No plan documents for {venture} yet. Upload the deck, financial model or
          raise memo above and it will be listed here for the team.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {rows.map(d => (
            <div key={d._id} style={{
              background: 'var(--card-bg)', padding: '0.9rem 1.25rem',
              display: 'grid', gridTemplateColumns: '60px 1fr 90px 150px 70px', gap: '1.25rem', alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.08em',
                color: accent, border: `1px solid ${accent}`, padding: '0.15rem 0.35rem',
                textAlign: 'center', whiteSpace: 'nowrap',
              }}>{formatExt(d.name)}</span>

              <div style={{ minWidth: 0 }}>
                {/* The signed URL is regenerated per read, so this link is only
                    valid for as long as the page is open — which is correct. */}
                <a
                  href={d.url ?? '#'} target="_blank" rel="noopener noreferrer"
                  style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--off-white)', textDecoration: 'none', wordBreak: 'break-word' }}
                >{d.name}</a>
                {d.note && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.6, marginTop: '0.2rem' }}>
                    {d.note}
                  </div>
                )}
              </div>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--muted)' }}>{formatSize(d.size)}</span>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                {formatDate(d.uploadedAt)}<br />
                <span style={{ fontSize: '0.58rem' }}>{d.uploaderName}</span>
              </span>

              <button
                onClick={() => void removeDoc({ id: d._id })}
                title={`Delete ${d.name}`}
                aria-label={`Delete ${d.name}`}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.08em',
                  textTransform: 'uppercase', padding: '0.25rem 0.5rem', cursor: 'pointer',
                  background: 'transparent', border: '1px solid var(--card-border)',
                  color: 'var(--muted)', transition: 'all 0.12s', justifySelf: 'end',
                }}
              >Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)',
  letterSpacing: '0.12em', textTransform: 'uppercase',
};
