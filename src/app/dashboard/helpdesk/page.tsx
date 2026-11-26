'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePaginatedQuery, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const statuses = ['new', 'open', 'waiting_on_user', 'waiting_internal', 'resolved', 'closed'] as const;
type Status = typeof statuses[number];
const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (x) => x.toUpperCase());
const dateTime = (value: number) => new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function HelpDeskPage() {
  const [status, setStatus] = useState<Status | ''>('');
  const [priority, setPriority] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const summary = useQuery(api.support.ticketSummary, { venture: 'Franchiseen' });
  const { results, status: pageStatus, loadMore } = usePaginatedQuery(
    api.support.listTickets,
    { venture: 'Franchiseen', status: status || undefined, priority: priority || undefined, search: search || undefined },
    { initialNumItems: 30 },
  );

  const rows = useMemo(() => results ?? [], [results]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 className="page-title">Help Desk</h1>
          <p className="page-sub">Franchiseen support requests, managed centrally in Codelude HQ.</p>
        </div>
        <Link href="/dashboard/helpdesk/articles" className="button">Manage help articles</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, margin: '1.25rem 0' }}>
        {[
          ['Open', summary?.open], ['New', summary?.new], ['Unassigned', summary?.unassigned], ['Urgent', summary?.urgent],
        ].map(([name, value]) => (
          <div key={String(name)} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1rem 1.1rem' }}>
            <div style={{ color: 'var(--muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{name}</div>
            <div style={{ color: 'var(--off-white)', fontSize: '1.6rem', marginTop: 4 }}>{value ?? '—'}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '1rem 0', alignItems: 'center' }}>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') setSearch(searchInput.trim()); }} placeholder="Search tickets, requesters…" aria-label="Search tickets" style={inputStyle} />
        <button className="button" onClick={() => setSearch(searchInput.trim())}>Search</button>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status | '')} aria-label="Filter by status" style={selectStyle}>
          <option value="">All statuses</option>{statuses.map((s) => <option key={s} value={s}>{label(s)}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority" style={selectStyle}>
          <option value="">All priorities</option>{['urgent', 'high', 'normal', 'low'].map((p) => <option key={p} value={p}>{label(p)}</option>)}
        </select>
      </div>

      <div style={{ overflowX: 'auto', border: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
          <thead><tr>{['Ticket', 'Requester', 'Category', 'Priority', 'Status', 'Last activity'].map((x) => <th key={x} style={th}>{x}</th>)}</tr></thead>
          <tbody>
            {rows.map((ticket) => (
              <tr key={ticket._id}>
                <td style={td}><Link href={`/dashboard/helpdesk/${ticket._id}`} style={{ color: 'var(--off-white)', fontWeight: 600 }}>{ticket.subject}</Link><div style={meta}>{ticket.ticketNumber}</div></td>
                <td style={td}>{ticket.requesterName || 'Marketplace user'}<div style={meta}>{ticket.requesterEmail}</div></td>
                <td style={td}>{label(ticket.category)}</td>
                <td style={td}><span style={{ color: ticket.priority === 'urgent' ? '#f07868' : 'var(--off-white)' }}>{label(ticket.priority)}</span></td>
                <td style={td}><span style={badge}>{label(ticket.status)}</span></td>
                <td style={td}>{dateTime(ticket.lastActivityAt)}</td>
              </tr>
            ))}
            {pageStatus === 'LoadingFirstPage' && <tr><td style={empty} colSpan={6}>Loading support requests…</td></tr>}
            {pageStatus !== 'LoadingFirstPage' && rows.length === 0 && <tr><td style={empty} colSpan={6}>No support requests match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      {pageStatus === 'CanLoadMore' && <button className="button" onClick={() => loadMore(30)} style={{ marginTop: 14 }}>Load more</button>}
      {pageStatus === 'LoadingMore' && <p className="page-sub">Loading more…</p>}
    </div>
  );
}

const inputStyle: React.CSSProperties = { flex: '1 1 260px', minWidth: 220, padding: '0.7rem 0.8rem', background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)' };
const selectStyle: React.CSSProperties = { padding: '0.7rem 0.8rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)' };
const th: React.CSSProperties = { textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', padding: '0.85rem 0.9rem', borderBottom: '1px solid var(--card-border)' };
const td: React.CSSProperties = { padding: '0.9rem', borderBottom: '1px solid var(--card-border)', color: 'var(--off-white)', fontSize: '0.82rem', verticalAlign: 'top' };
const meta: React.CSSProperties = { color: 'var(--muted)', fontSize: '0.67rem', marginTop: 4 };
const badge: React.CSSProperties = { display: 'inline-block', padding: '0.2rem 0.45rem', border: '1px solid var(--card-border)', color: 'var(--muted)', fontSize: '0.68rem' };
const empty: React.CSSProperties = { padding: '2rem', color: 'var(--muted)', textAlign: 'center' };
