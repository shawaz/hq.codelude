'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useActiveScope } from '@/lib/use-active-scope';
import { sc, scBorder } from '@/lib/status-colors';

type Platform = 'Instagram' | 'X' | 'LinkedIn';
type ContentType = 'Post' | 'Thread' | 'Carousel' | 'Reel' | 'Article';
type ContentStatus = 'idea' | 'draft' | 'review' | 'approved' | 'scheduled' | 'publishing' | 'published' | 'failed' | 'archived';

const statuses: ContentStatus[] = ['idea', 'draft', 'review', 'approved', 'scheduled', 'published', 'failed'];
const statusLabel = (value: string) => value.replace('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const owners: Record<string, string> = { Shawaz: 'Smithers', Codelude: 'Smithers', Roborns: 'Lisa', Nanotrade: 'Bart', HubCV: 'Marge', Franchiseen: 'Homer' };
const accounts: Record<string, string> = { Shawaz: 'Personal account', Codelude: 'Codelude company account', Roborns: 'Roborns accounts', Nanotrade: 'NanoTrade / Dextrip accounts', HubCV: 'HUBCV accounts', Franchiseen: 'Franchiseen accounts' };

export default function ContentPage() {
  const { scope, loading } = useActiveScope('content');
  const venture = scope?.name ?? '';
  const rows = useQuery(api.content.list, venture ? { venture } : 'skip');
  const create = useMutation(api.content.create);
  const setStatus = useMutation(api.content.setStatus);
  const remove = useMutation(api.content.remove);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<ContentStatus | 'all'>('all');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', body: '', platform: 'LinkedIn' as Platform, type: 'Post' as ContentType, scheduledAt: '', owner: owners[venture] ?? 'Smithers' });

  const filtered = useMemo(() => (rows ?? []).filter((row) => filter === 'all' || row.status === filter), [rows, filter]);
  if (loading || rows === undefined) return null;
  if (!scope) return <div><h1 className="page-title">Content</h1><p className="page-sub">You do not have access to this content workspace.</p></div>;

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true); setError('');
    try {
      await create({
        venture, account: accounts[venture] ?? `${venture} accounts`, platform: form.platform, type: form.type,
        status: form.scheduledAt ? 'scheduled' : 'draft', title: form.title, body: form.body,
        owner: form.owner, ...(form.scheduledAt ? { scheduledAt: new Date(form.scheduledAt).getTime() } : {}),
      });
      setForm({ ...form, title: '', body: '', scheduledAt: '' });
      setShowForm(false);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not save content'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <div><h1 className="page-title">Content scheduler</h1><p className="page-sub">Draft, approve, schedule, and track {venture} content. Publishing stays approval-controlled.</p></div>
        <button className="button-primary" onClick={() => setShowForm((value) => !value)}>{showForm ? 'Cancel' : '+ New content'}</button>
      </div>

      {showForm && <section className="card" style={{ margin: '1.25rem 0', padding: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Create content item</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem' }}>
          <input className="text-input" placeholder="Title" value={form.title} onChange={(event) => update('title', event.target.value)} />
          <select className="text-input" value={form.platform} onChange={(event) => update('platform', event.target.value)}>{(['Instagram', 'X', 'LinkedIn'] as Platform[]).map((value) => <option key={value}>{value}</option>)}</select>
          <select className="text-input" value={form.type} onChange={(event) => update('type', event.target.value)}>{(['Post', 'Thread', 'Carousel', 'Reel', 'Article'] as ContentType[]).map((value) => <option key={value}>{value}</option>)}</select>
        </div>
        <textarea className="text-input" style={{ width: '100%', minHeight: 130, marginTop: '0.75rem', resize: 'vertical' }} placeholder="Write the draft caption or post body..." value={form.body} onChange={(event) => update('body', event.target.value)} />
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <label className="category-label">Schedule <input className="text-input" type="datetime-local" value={form.scheduledAt} onChange={(event) => update('scheduledAt', event.target.value)} /></label>
          <label className="category-label">Owner <input className="text-input" value={form.owner} onChange={(event) => update('owner', event.target.value)} /></label>
          <button className="button-primary" disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save draft'}</button>
        </div>
        {error && <p style={{ color: '#e07a7a', marginBottom: 0 }}>{error}</p>}
      </section>}

      <div className="filter-bar" style={{ margin: '1.25rem 0' }}>
        <button className={`filter-pill${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All ({rows.length})</button>
        {statuses.map((value) => <button key={value} className={`filter-pill${filter === value ? ' active' : ''}`} onClick={() => setFilter(value)}>{statusLabel(value)}</button>)}
      </div>

      <table className="tasks-table"><thead><tr><th style={{ width: '30%' }}>Content</th><th>Platform</th><th>Owner</th><th>Schedule</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((row) => <tr key={row._id}>
          <td><div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{row.title}</div><div style={{ color: 'var(--muted)', fontSize: '0.65rem', marginTop: '0.3rem', whiteSpace: 'pre-wrap' }}>{row.body.slice(0, 180)}{row.body.length > 180 ? '…' : ''}</div></td>
          <td><span className="category-label">{row.platform} · {row.type}</span></td>
          <td><span className="category-label">{row.owner}</span></td>
          <td><span className="category-label">{row.scheduledAt ? new Date(row.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Unscheduled'}</span></td>
          <td><span className="status-badge" style={{ color: sc(row.status === 'published' ? '#dbdbdb' : row.status === 'failed' ? '#e07a7a' : '#b5b5b5'), borderColor: scBorder(row.status === 'failed' ? '#e07a7a' : '#b5b5b5') }}>{statusLabel(row.status)}</span></td>
          <td><div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>{row.status === 'draft' && <button className="filter-pill" onClick={() => setStatus({ id: row._id, status: 'review' })}>Submit review</button>}{row.status === 'review' && <button className="filter-pill" onClick={() => setStatus({ id: row._id, status: 'approved' })}>Approve</button>}{row.status === 'approved' && <button className="filter-pill" onClick={() => setStatus({ id: row._id, status: 'scheduled', scheduledAt: row.scheduledAt })}>Schedule</button>}<button className="filter-pill" onClick={() => remove({ id: row._id })}>Delete</button></div></td>
        </tr>)}</tbody>
      </table>
      {filtered.length === 0 && <div className="card" style={{ padding: '2rem', marginTop: '1rem' }}><p className="page-sub">No content items in this view. Create the first draft above.</p></div>}
    </div>
  );
}
