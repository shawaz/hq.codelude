'use client';

import { useState, useMemo, FormEvent } from 'react';
import { usePaginatedQuery, useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import ConvertToProjectButton from '@/components/ConvertToProjectButton';
import {
  VENTURES, SEGMENTS, STATUSES, STAGE_META, statusColor,
  type Stage, type Segment,
} from '@/lib/pipeline-config';
import { usePageScopes, clampIndex } from '@/lib/use-page-scopes';

const PAGE_SIZE = 50;
const nf = new Intl.NumberFormat('en-IN');

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)',
  letterSpacing: '0.08em', textTransform: 'uppercase',
};
const inputStyle: React.CSSProperties = {
  width: '100%', marginTop: '0.3rem', padding: '0.45rem 0.6rem',
  background: 'var(--black)', border: '1px solid var(--card-border)',
  color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
};

function str(fd: FormData, key: string): string | undefined {
  const val = String(fd.get(key) ?? '').trim();
  return val === '' ? undefined : val;
}

// ─── ADD FORM ─────────────────────────────────────────────────────────────────

type FormField = { name: string; label: string; type?: string; required?: boolean };

const CORE_FIELDS: FormField[] = [
  { name: 'name',        label: 'Name',            required: true },
  { name: 'category',    label: 'Company / type'                  },
  { name: 'contactName', label: 'Contact person'                  },
  { name: 'email',       label: 'Email', type: 'email'            },
  { name: 'phone',       label: 'Phone'                           },
  { name: 'city',        label: 'City'                            },
  { name: 'state',       label: 'State'                           },
];

/** Extra fields that only make sense at certain funnel positions. */
const STAGE_FIELDS: Record<Stage, FormField[]> = {
  prospect: [
    { name: 'code',     label: 'Registry code' },
    { name: 'district', label: 'District' },
    { name: 'website',  label: 'Website' },
    { name: 'size',     label: 'Size (people)', type: 'number' },
  ],
  lead: [
    { name: 'interest', label: 'Interested in' },
    { name: 'website',  label: 'Website' },
  ],
  deal: [
    { name: 'value',     label: 'Deal value' },
    { name: 'closeDate', label: 'Target close' },
    { name: 'meetingAt', label: 'Call / appointment', type: 'datetime-local' },
  ],
  client: [
    { name: 'value', label: 'Contract value' },
    { name: 'since', label: 'Client since', type: 'date' },
  ],
};

function AddForm({
  stage, venture, segment, color, onClose,
}: { stage: Stage; venture: string; segment: Segment; color: string; onClose: () => void }) {
  const add = useMutation(api.pipeline.add);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fields = [...CORE_FIELDS, ...STAGE_FIELDS[stage]];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') ?? '').trim();
    if (!name) { setError('Name is required.'); return; }

    setSaving(true);
    setError('');
    try {
      const sizeRaw = String(fd.get('size') ?? '').trim();
      const meetRaw = String(fd.get('meetingAt') ?? '').trim();
      await add({
        stage, venture, segment: segment.key, name,
        category:    str(fd, 'category'),
        contactName: str(fd, 'contactName'),
        email:       str(fd, 'email'),
        phone:       str(fd, 'phone'),
        city:        str(fd, 'city'),
        state:       str(fd, 'state'),
        district:    str(fd, 'district'),
        website:     str(fd, 'website'),
        code:        str(fd, 'code'),
        interest:    str(fd, 'interest'),
        value:       str(fd, 'value'),
        closeDate:   str(fd, 'closeDate'),
        since:       str(fd, 'since'),
        size:        sizeRaw ? Number(sizeRaw) : undefined,
        meetingAt:   meetRaw ? new Date(meetRaw).getTime() : undefined,
        status:      String(fd.get('status') ?? STATUSES[stage][0].key),
        priority:    String(fd.get('priority') ?? 'medium'),
        notes:       str(fd, 'notes'),
        source:      'manual',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      borderTop: `2px solid ${color}`, padding: '1.5rem', marginBottom: '1.5rem',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color,
        letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        New {STAGE_META[stage].title.replace(/s$/, '')} — {venture} · {segment.label}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {fields.map(f => (
          <label key={f.name} style={labelStyle}>
            {f.label}{f.required && <span style={{ color }}> *</span>}
            <input name={f.name} type={f.type ?? 'text'}
              required={f.required} style={inputStyle} />
          </label>
        ))}
        <label style={labelStyle}>
          Status
          <select name="status" defaultValue={STATUSES[stage][0].key} style={inputStyle}>
            {STATUSES[stage].map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          Priority
          <select name="priority" defaultValue="medium" style={inputStyle}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
      </div>

      <label style={{ ...labelStyle, marginTop: '0.75rem', display: 'block' }}>
        Notes
        <textarea name="notes" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
      </label>

      {error && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          color: '#ff8080', marginTop: '0.75rem' }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button type="submit" disabled={saving} style={{
          padding: '0.5rem 1.4rem', border: 'none', cursor: saving ? 'default' : 'pointer',
          background: color, color: 'var(--on-brand)', fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          fontWeight: 700, opacity: saving ? 0.6 : 1,
        }}>{saving ? 'Saving…' : 'Save'}</button>
        <button type="button" onClick={onClose} style={{
          padding: '0.5rem 1.4rem', border: '1px solid var(--card-border)',
          background: 'transparent', color: 'var(--muted)', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>Cancel</button>
      </div>
    </form>
  );
}

// ─── BOARD ────────────────────────────────────────────────────────────────────

/** Each pipeline stage renders its own dashboard page — that is the permission key. */
const STAGE_PAGE: Record<Stage, string> = {
  prospect: 'prospects',
  lead: 'leads',
  deal: 'deals',
  client: 'clients',
};

export default function PipelineBoard({ stage }: { stage: Stage }) {
  const meta = STAGE_META[stage];

  // Must filter before querying, not after: pipeline.stats and pipeline.list
  // now throw on an ungranted (venture, page), so pointing them at a venture
  // this user lacks would error the whole page rather than just show nothing.
  const { names: allowed, loading } = usePageScopes(STAGE_PAGE[stage]);
  const ventures = VENTURES.filter(v => allowed.includes(v.name) && SEGMENTS[v.name]);

  const [vi, setVi] = useState(0);
  const [segKey, setSegKey] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(false);

  const index    = clampIndex(vi, ventures.length);
  const venture  = ventures[index];
  const segments = venture ? SEGMENTS[venture.name] : [];
  const segment  = segments.find(s => s.key === segKey) ?? segments[0];

  // "skip" keeps the queries from firing until we know the venture is allowed.
  const statRows = useQuery(
    api.pipeline.stats,
    venture ? { stage, venture: venture.name } : 'skip',
  );

  const { results, status: pageStatus, loadMore } = usePaginatedQuery(
    api.pipeline.list,
    venture && segment
      ? {
          stage,
          venture: venture.name,
          segment: segment.key,
          status: status ?? undefined,
          search: search || undefined,
        }
      : 'skip',
    { initialNumItems: PAGE_SIZE },
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const row of statRows ?? []) {
      if (row.status === '*') map[row.segment] = row.count;
    }
    return map;
  }, [statRows]);

  const segmentTotal = counts[segment.key] ?? 0;
  const ventureTotal = Object.values(counts).reduce((a, b) => a + b, 0);

  function reset() {
    setStatus(null); setSearchInput(''); setSearch(''); setAdding(false);
  }
  function selectVenture(i: number) {
    setVi(i);
    setSegKey(SEGMENTS[ventures[i].name][0].key);
    reset();
  }

  if (loading) return null;
  if (!venture) {
    return (
      <div>
        <h1 className="page-title">{meta.title}</h1>
        <p className="page-sub">{meta.sub}</p>
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
          You do not have access to any ventures on this page.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">{meta.title}</h1>
      <p className="page-sub">{meta.sub}</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)',
        border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {ventures.map((v, i) => (
          <button key={v.name} onClick={() => selectVenture(i)} style={{
            flex: 1, padding: '0.8rem 0.5rem',
            background: index === i ? v.color : 'var(--card-bg)',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em',
            color: index === i ? 'var(--on-brand)' : 'var(--muted)',
            fontWeight: index === i ? 700 : 400, transition: 'all 0.15s',
          }}>{v.name}</button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${venture.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: venture.color,
          letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{venture.sector}</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '-0.01em',
          display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {venture.name}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'var(--muted)', fontWeight: 400, letterSpacing: '0.1em' }}>
            {segments.map(s => `${nf.format(counts[s.key] ?? 0)} ${s.unit}`).join(' · ')}
            {ventureTotal > 0 && ` · ${nf.format(ventureTotal)} total`}
          </span>
        </div>
      </div>

      {/* Segment tabs + Add New */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
          {segments.map(s => (
            <button key={s.key} onClick={() => { setSegKey(s.key); reset(); }} style={{
              padding: '0.55rem 1.3rem', border: '1px solid', cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
              textTransform: 'uppercase', transition: 'all 0.15s',
              background: segment.key === s.key ? 'var(--off-white)' : 'transparent',
              borderColor: segment.key === s.key ? 'var(--off-white)' : 'var(--card-border)',
              color: segment.key === s.key ? 'var(--black)' : 'var(--muted)',
            }}>
              {s.label}
              {counts[s.key] > 0 && (
                <span style={{ marginLeft: '0.5rem', opacity: 0.65, fontSize: '0.58rem' }}>
                  {nf.format(counts[s.key])}
                </span>
              )}
            </button>
          ))}
        </div>

        <button onClick={() => setAdding(a => !a)} style={{
          padding: '0.55rem 1.3rem', cursor: 'pointer',
          border: `1px solid ${venture.color}`,
          background: adding ? venture.color : 'transparent',
          color: adding ? 'var(--black)' : venture.color,
          fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
          letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700,
        }}>{adding ? 'Close' : '+ Add New'}</button>
      </div>

      {adding && (
        <AddForm stage={stage} venture={venture.name} segment={segment}
          color={venture.color} onClose={() => setAdding(false)} />
      )}

      {/* Search + status filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={e => { e.preventDefault(); setSearch(searchInput.trim()); }}>
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
            placeholder={`Search ${segment.unit}…`}
            style={{ ...inputStyle, width: 240, marginTop: 0 }} />
        </form>
        <button className={`filter-pill${status === null ? ' active' : ''}`}
          onClick={() => setStatus(null)}>All</button>
        {STATUSES[stage].map(s => (
          <button key={s.key} className={`filter-pill${status === s.key ? ' active' : ''}`}
            style={status === s.key ? { borderColor: s.color, color: s.color } : {}}
            onClick={() => setStatus(s.key)}>{s.label}</button>
        ))}
      </div>

      <RecordList stage={stage} results={results as RecordRow[]} pageStatus={pageStatus}
        segment={segment} segmentTotal={segmentTotal} search={search}
        accent={venture.color} venture={venture.name} />

      {pageStatus === 'CanLoadMore' && (
        <button onClick={() => loadMore(PAGE_SIZE)} style={{
          marginTop: '1rem', padding: '0.6rem 1.5rem', width: '100%',
          border: '1px solid var(--card-border)', background: 'var(--card-bg)',
          color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>Load {PAGE_SIZE} more</button>
      )}

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)',
        marginTop: '1.5rem', lineHeight: 1.7, opacity: 0.7 }}>
        Showing {nf.format(results.length)} of {nf.format(segmentTotal)} {segment.unit}.
        Rows load {PAGE_SIZE} at a time from the server.
      </p>
    </div>
  );
}

// ─── LIST ─────────────────────────────────────────────────────────────────────

type RecordRow = {
  _id: Id<'pipeline_orgs'>; name: string; code?: string; category?: string;
  state?: string; district?: string; city?: string;
  contactName?: string; email?: string; phone?: string;
  size?: number; status: string; priority?: string; notes?: string;
  source?: string; interest?: string; message?: string;
  value?: string; meetingAt?: number; meetingNote?: string;
  closeDate?: string; since?: string;
  config?: string; boundary?: GeoJSON.Polygon;
  center?: [number, number]; areaHectares?: number;
};

function fmtMeeting(ms?: number) {
  if (!ms) return null;
  return new Date(ms).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}
/** Epoch ms → the `YYYY-MM-DDTHH:mm` shape datetime-local expects, in local time. */
function toLocalInput(ms?: number) {
  if (!ms) return '';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function RecordList({
  stage, results, pageStatus, segment, segmentTotal, search, accent, venture,
}: {
  stage: Stage; results: readonly RecordRow[]; pageStatus: string;
  segment: Segment; segmentTotal: number; search: string; accent: string;
  venture: string;
}) {
  const setStatus = useMutation(api.pipeline.setStatus);
  const setMeeting = useMutation(api.pipeline.setMeeting);
  const convert = useMutation(api.pipeline.convert);
  const meta = STAGE_META[stage];

  if (pageStatus === 'LoadingFirstPage') return <Empty>Loading {segment.unit}…</Empty>;

  if (results.length === 0) {
    return (
      <Empty>
        {search
          ? `No ${segment.unit} match “${search}”.`
          : segmentTotal === 0
            ? stage === 'lead'
              ? `No inbound ${segment.unit} yet. Submissions to /api/leads land here automatically.`
              : `No ${segment.unit} yet. Use “+ Add New”, or convert from the previous stage.`
            : `No ${segment.unit} match this filter.`}
      </Empty>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px',
      background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
      {results.map(o => (
        <div key={o._id} style={{ background: 'var(--card-bg)', padding: '1rem 1.5rem',
          display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr auto auto', gap: '1rem',
          alignItems: 'center' }}>

          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.2rem' }}>{o.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>
              {[o.category, o.code, o.interest].filter(Boolean).join(' · ') || '—'}
            </div>
            {stage === 'lead' && o.source && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem',
                color: accent, marginTop: '0.2rem' }}>via {o.source}</div>
            )}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>
            {[o.city, o.district, o.state].filter(Boolean).join(', ') || '—'}
            {o.size != null && (
              <div style={{ fontSize: '0.56rem', opacity: 0.7, marginTop: '0.15rem' }}>
                {nf.format(o.size)} people
              </div>
            )}
            {(stage === 'deal' || stage === 'client') && o.value && (
              <div style={{ fontSize: '0.6rem', color: accent, marginTop: '0.15rem' }}>{o.value}</div>
            )}
            {stage === 'client' && o.since && (
              <div style={{ fontSize: '0.56rem', opacity: 0.7, marginTop: '0.15rem' }}>since {o.since}</div>
            )}
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', minWidth: 0 }}>
            {o.contactName && <div>{o.contactName}</div>}
            {o.email && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.email}</div>}
            {o.phone && <div style={{ opacity: 0.7 }}>{o.phone}</div>}
            {!o.contactName && !o.email && !o.phone && '—'}
          </div>

          {/* Deals get an inline scheduler; other stages keep the column aligned. */}
          {stage === 'deal' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <input
                type="datetime-local"
                defaultValue={toLocalInput(o.meetingAt)}
                onChange={e => {
                  const v = e.target.value;
                  void setMeeting({ id: o._id, meetingAt: v ? new Date(v).getTime() : undefined });
                }}
                style={{ ...inputStyle, marginTop: 0, width: 190, fontSize: '0.58rem', padding: '0.25rem 0.4rem' }}
              />
              {o.meetingAt != null && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem',
                  color: o.meetingAt < Date.now() ? '#ff8080' : '#5DCAA5' }}>
                  {o.meetingAt < Date.now() ? 'past · ' : 'upcoming · '}{fmtMeeting(o.meetingAt)}
                </span>
              )}
            </div>
          ) : <div />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
            <select
              value={o.status}
              onChange={e => { void setStatus({ id: o._id, status: e.target.value }); }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '0.2rem 0.5rem', cursor: 'pointer',
                background: 'transparent', color: statusColor(stage, o.status),
                border: `1px solid ${statusColor(stage, o.status)}40`,
              }}
            >
              {STATUSES[stage].map(s => (
                <option key={s.key} value={s.key} style={{ background: 'var(--black)' }}>{s.label}</option>
              ))}
            </select>

            {stage === 'lead' && venture === 'Roborns' && (o.boundary || o.config) && (
              <ConvertToProjectButton lead={{
                id: o._id, name: o.name, venture,
                config: o.config, boundary: o.boundary,
                center: o.center, areaHectares: o.areaHectares,
              }} />
            )}

            {meta.next && (
              <button
                onClick={() => { void convert({ id: o._id }); }}
                title={`Move to ${meta.next}`}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '0.2rem 0.5rem', cursor: 'pointer',
                  background: 'transparent', color: accent,
                  border: `1px solid ${accent}40`, whiteSpace: 'nowrap',
                }}
              >{meta.convertLabel} →</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)',
      padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
      color: 'var(--muted)', lineHeight: 1.8 }}>
      {children}
    </div>
  );
}
