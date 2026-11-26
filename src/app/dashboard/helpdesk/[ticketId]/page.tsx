'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

const statusOptions = ['new', 'open', 'waiting_on_user', 'waiting_internal', 'resolved', 'closed'] as const;
const label = (value: string) => value.replaceAll('_', ' ').replace(/\b\w/g, (x) => x.toUpperCase());
const dateTime = (value: number) => new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

export default function SupportTicketPage() {
  const params = useParams<{ ticketId: string }>();
  const ticketId = params.ticketId as Id<'supportTickets'>;
  const detail = useQuery(api.support.ticketDetail, { ticketId });
  const assignees = useQuery(api.support.listAssignees, { venture: 'Franchiseen' });
  const setState = useMutation(api.support.setTicketState);
  const setPriority = useMutation(api.support.setTicketPriority);
  const assign = useMutation(api.support.assignTicket);
  const addMessage = useMutation(api.support.addAgentMessage);
  const [body, setBody] = useState('');
  const [visibility, setVisibility] = useState<'requester' | 'internal'>('requester');
  const [resolution, setResolution] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (detail === undefined) return <p className="page-sub">Loading ticket…</p>;
  if (!detail) return <><Link href="/dashboard/helpdesk">← Help Desk</Link><h1 className="page-title">Ticket not found</h1></>;
  const { ticket } = detail;

  async function changeState(nextStatus: typeof statusOptions[number]) {
    setBusy(true); setError('');
    try { await setState({ ticketId, status: nextStatus, expectedVersion: ticket.version, resolutionSummary: resolution || undefined }); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not update the ticket.'); }
    finally { setBusy(false); }
  }

  async function submitMessage(event: FormEvent) {
    event.preventDefault();
    if (!body.trim()) return;
    setBusy(true); setError('');
    try { await addMessage({ ticketId, body, visibility, expectedVersion: ticket.version }); setBody(''); }
    catch (err) { setError(err instanceof Error ? err.message : 'Could not save the message.'); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ maxWidth: 1040 }}>
      <Link href="/dashboard/helpdesk" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>← Back to Help Desk</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', alignItems: 'start', marginTop: 14 }}>
        <div><h1 className="page-title" style={{ marginBottom: 6 }}>{ticket.subject}</h1><p className="page-sub" style={{ margin: 0 }}>{ticket.ticketNumber} · {label(ticket.category)} · {ticket.requesterName || 'Marketplace user'} · {ticket.requesterEmail}</p></div>
        <span style={badge}>{label(ticket.status)} · {label(ticket.priority)}</span>
      </div>
      {error && <p role="alert" style={{ color: '#ff9386' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(240px,1fr)', gap: 16, marginTop: 20 }}>
        <section>
          <article style={card}><div style={eyebrow}>Initial request · {dateTime(ticket.createdAt)}</div><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{ticket.description}</p>
            {ticket.contextLabel && <div style={context}>Marketplace context: {ticket.contextLabel} {ticket.contextType ? `· ${label(ticket.contextType)}` : ''}</div>}
          </article>
          <h2 style={sectionTitle}>Conversation</h2>
          {[...detail.messages].sort((a, b) => a.createdAt - b.createdAt).map((message) => (
            <article key={message._id} style={{ ...card, borderLeft: `3px solid ${message.visibility === 'internal' ? '#d9aa5c' : 'var(--card-border)'}` }}>
              <div style={eyebrow}>{message.visibility === 'internal' ? 'Internal note' : 'Requester visible'} · {message.authorName || message.authorEmail} · {dateTime(message.createdAt)}</div>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, marginBottom: 0 }}>{message.body}</p>
            </article>
          ))}
          <form onSubmit={submitMessage} style={card}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
              <label style={radio}><input type="radio" checked={visibility === 'requester'} onChange={() => setVisibility('requester')} /> Reply to requester</label>
              <label style={radio}><input type="radio" checked={visibility === 'internal'} onChange={() => setVisibility('internal')} /> Internal note</label>
            </div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} maxLength={10000} placeholder={visibility === 'internal' ? 'Visible only to authorized HQ staff' : 'Write a response to the requester'} style={textarea} />
            <button className="button" disabled={busy || !body.trim()} style={{ marginTop: 12 }}>{busy ? 'Saving…' : visibility === 'internal' ? 'Add internal note' : 'Send reply'}</button>
          </form>
        </section>

        <aside>
          <section style={card}><h2 style={sectionTitle}>Ticket controls</h2>
            <label style={fieldLabel}>Status<select value={ticket.status} onChange={(e) => void changeState(e.target.value as typeof statusOptions[number])} style={select} disabled={busy}>{statusOptions.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></label>
            <label style={fieldLabel}>Priority<select value={ticket.priority} onChange={async (e) => { setBusy(true); setError(''); try { await setPriority({ ticketId, priority: e.target.value as 'urgent'|'high'|'normal'|'low', expectedVersion: ticket.version }); } catch (err) { setError(err instanceof Error ? err.message : 'Could not update priority.'); } finally { setBusy(false); } }} style={select} disabled={busy}>{['urgent','high','normal','low'].map((p) => <option key={p} value={p}>{label(p)}</option>)}</select></label>
            <label style={fieldLabel}>Assignee<select value={ticket.assigneeId ?? ''} onChange={async (e) => { setBusy(true); setError(''); try { await assign({ ticketId, assigneeId: e.target.value ? e.target.value as Id<'users'> : undefined, expectedVersion: ticket.version }); } catch (err) { setError(err instanceof Error ? err.message : 'Could not assign ticket.'); } finally { setBusy(false); } }} style={select} disabled={busy}><option value="">Unassigned</option>{(assignees ?? []).map((person) => <option key={person._id} value={person._id}>{person.name}</option>)}</select></label>
            {ticket.status === 'resolved' && <label style={fieldLabel}>Resolution summary<textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows={3} style={textarea} /></label>}
          </section>
          <section style={card}><h2 style={sectionTitle}>Private attachments</h2>{detail.attachments.length ? detail.attachments.map((file) => <div key={file._id} style={eyebrow}>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</div>) : <p style={muted}>No files attached.</p>}<p style={muted}>Files are stored privately. Download access is limited to the ticket owner and authorized support staff.</p></section>
          <section style={card}><h2 style={sectionTitle}>Activity</h2>{[...detail.events].sort((a, b) => b.createdAt - a.createdAt).map((event) => <div key={event._id} style={{ ...eyebrow, padding: '8px 0', borderBottom: '1px solid var(--card-border)' }}>{label(event.kind)}{event.toValue ? ` · ${event.toValue}` : ''}<br />{dateTime(event.createdAt)}</div>)}</section>
        </aside>
      </div>
    </div>
  );
}

const card: React.CSSProperties = { background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1rem 1.1rem', marginBottom: 12, color: 'var(--off-white)' };
const eyebrow: React.CSSProperties = { color: 'var(--muted)', fontSize: '0.68rem', letterSpacing: '0.04em', textTransform: 'uppercase' };
const sectionTitle: React.CSSProperties = { fontSize: '1rem', color: 'var(--off-white)', margin: '0 0 12px' };
const context: React.CSSProperties = { borderTop: '1px solid var(--card-border)', paddingTop: 10, color: 'var(--muted)', fontSize: '0.78rem' };
const badge: React.CSSProperties = { padding: '0.35rem 0.65rem', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontSize: '0.72rem' };
const fieldLabel: React.CSSProperties = { display: 'block', color: 'var(--muted)', fontSize: '0.72rem', marginBottom: 12 };
const select: React.CSSProperties = { display: 'block', width: '100%', marginTop: 5, padding: '0.55rem', color: 'var(--off-white)', background: 'var(--black)', border: '1px solid var(--card-border)' };
const textarea: React.CSSProperties = { boxSizing: 'border-box', width: '100%', padding: '0.7rem', color: 'var(--off-white)', background: 'var(--black)', border: '1px solid var(--card-border)', resize: 'vertical' };
const muted: React.CSSProperties = { color: 'var(--muted)', fontSize: '0.72rem', lineHeight: 1.6 };
const radio: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: '0.75rem' };
