'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PROJECT_COLORS, type Project } from '@/lib/tasks';
import { sc, scBorder } from '@/lib/status-colors';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Note { id: string; text: string; createdAt: string; }
interface FileRec { id: string; name: string; url: string; size: number; type: string; uploadedAt: string; }
interface Message { role: 'user' | 'assistant'; content: string; }

type Tab = 'notes' | 'files' | 'ai';

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ext(name: string): string {
  const i = name.lastIndexOf('.');
  return i === -1 ? '—' : name.slice(i + 1).toUpperCase();
}

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const taskId = params.id;
  // Accepts a Convex id or an original seedId, so links minted before the
  // migration still resolve.
  const task = useQuery(api.tasks.get, { key: taskId });

  const [tab, setTab] = useState<Tab>('notes');

  if (task === undefined) {
    return (
      <div>
        <Link href="/dashboard/tasks" className="task-back">← Back to tasks</Link>
        <p className="page-sub">Loading…</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div>
        <Link href="/dashboard/tasks" className="task-back">← Back to tasks</Link>
        <h1 className="page-title">Task not found</h1>
        <p className="page-sub">No task with id &ldquo;{taskId}&rdquo; exists.</p>
      </div>
    );
  }

  const color = PROJECT_COLORS[task.project as Project] ?? 'var(--muted)';

  return (
    <div style={{ maxWidth: 880 }}>
      <Link href="/dashboard/tasks" className="task-back">← Back to tasks</Link>

      <div className="task-detail-head">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{task.title}</h1>
          <div className="task-detail-meta">
            <span className="project-label">
              <span className="task-dot" style={{ background: color }} />
              {task.project}
            </span>
            <span className="category-label">· {task.category}</span>
            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
            <span className={`status-badge ${task.status}`}>
              {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'Todo'}
            </span>
          </div>
        </div>
      </div>

      <div className="task-tabs">
        <button className={`task-tab${tab === 'notes' ? ' active' : ''}`} onClick={() => setTab('notes')}>Notes</button>
        <button className={`task-tab${tab === 'files' ? ' active' : ''}`} onClick={() => setTab('files')}>Files</button>
        <button className={`task-tab${tab === 'ai' ? ' active' : ''}`} onClick={() => setTab('ai')}>Ask AI</button>
      </div>

      {tab === 'notes' && <NotesPanel taskId={task.seedId ?? task._id} />}
      {tab === 'files' && <FilesPanel taskId={task.seedId ?? task._id} />}
      {tab === 'ai'    && <TaskChat task={task} color={color} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Notes
// ─────────────────────────────────────────────────────────────────────
function NotesPanel({ taskId }: { taskId: string }) {
  const [notes, setNotes]     = useState<Note[]>([]);
  const [text, setText]       = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/notes`);
      setNotes(await res.json());
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [taskId]);

  async function addNote() {
    const value = text.trim();
    if (!value || saving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value }),
      });
      const note: Note = await res.json();
      setNotes(prev => [note, ...prev]);
      setText('');
    } finally { setSaving(false); }
  }

  async function removeNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id));
    await fetch(`/api/tasks/${taskId}/notes?noteId=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); addNote(); }
  }

  return (
    <div>
      <div className="note-form">
        <textarea
          className="form-input"
          placeholder="Write a note… (⌘/Ctrl + Enter to save)"
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          style={{ resize: 'vertical', fontSize: '0.72rem', lineHeight: 1.7 }}
        />
        <button className="btn-primary" onClick={addNote} disabled={!text.trim() || saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Saving…' : 'Add note'}
        </button>
      </div>

      {loading ? (
        <div className="empty-note">Loading notes…</div>
      ) : notes.length === 0 ? (
        <div className="empty-note">No notes yet — add the first one above.</div>
      ) : (
        <div className="note-list">
          {notes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-item-top">
                <span className="note-date">{fmtDate(note.createdAt)}</span>
                <button className="icon-btn" onClick={() => removeNote(note.id)}>Delete</button>
              </div>
              <div className="note-text">{note.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Files
// ─────────────────────────────────────────────────────────────────────
function FilesPanel({ taskId }: { taskId: string }) {
  const [files, setFiles]       = useState<FileRec[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/files`);
      setFiles(await res.json());
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [taskId]);

  async function handleFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    setError('');
    setUploading(true);
    try {
      for (const file of Array.from(list)) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch(`/api/tasks/${taskId}/files`, { method: 'POST', body: form });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? `Upload failed (${res.status})`);
          continue;
        }
        const rec: FileRec = await res.json();
        setFiles(prev => [rec, ...prev]);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function removeFile(id: string) {
    setFiles(prev => prev.filter(f => f.id !== id));
    await fetch(`/api/tasks/${taskId}/files?fileId=${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  return (
    <div>
      <div
        className="upload-zone"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', marginBottom: '0.75rem', fontWeight: 300 }}>
          Drag files here, or
        </p>
        <input
          ref={inputRef} type="file" multiple style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
        <button className="btn-primary" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Choose files'}
        </button>
        {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: sc('#ff8080'), marginTop: '0.75rem' }}>{error}</p>}
      </div>

      {loading ? (
        <div className="empty-note">Loading files…</div>
      ) : files.length === 0 ? (
        <div className="empty-note">No files attached yet.</div>
      ) : (
        <div className="file-list">
          {files.map(file => (
            <div key={file.id} className="file-item">
              <div className="file-item-left">
                <span className="file-icon">{ext(file.name)}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="file-name"><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></div>
                  <div className="file-meta">{fmtSize(file.size)} · {fmtDate(file.uploadedAt)}</div>
                </div>
              </div>
              <div className="file-actions">
                <a className="icon-btn" style={{ color: 'var(--muted)' }} href={file.url} target="_blank" rel="noopener noreferrer"
                   onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--off-white)'; }}
                   onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; }}>
                  Open
                </a>
                <button className="icon-btn" onClick={() => removeFile(file.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Ask AI — scoped to this task
// ─────────────────────────────────────────────────────────────────────
function TaskChat({ task, color }: { task: { title: string; project: string; category: string; status: string; priority: string }; color: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const systemOverride = `You are helping Shawaz, founder of Codelude, with a specific task on his internal company OS.

TASK: "${task.title}"
Venture: ${task.project}
Category: ${task.category}
Priority: ${task.priority}
Status: ${task.status}

Help him think through this task — break it down into steps, identify blockers, draft outreach or content related to it, or analyse how to approach it. Be direct and concise, like a sharp co-founder. Reference the task context directly in your answers.`;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next); setInput(''); setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, systemOverride }),
      });
      if (!res.body) throw new Error('No stream');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: reply }; return u; });
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${e.message}` }]);
    } finally { setLoading(false); inputRef.current?.focus(); }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const SUGGESTIONS = [
    `Break "${task.title}" down into concrete next steps`,
    'What could block this and how do I de-risk it?',
    'Draft an outreach message related to this task',
    'How should I prioritise this against my other work?',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--card-border)', height: 520 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', scrollbarWidth: 'none' }}>
        {messages.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>
              I have context on this task — &ldquo;{task.title}&rdquo; ({task.project}). Ask anything about how to approach it.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', padding: '0.3rem 0.75rem', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--off-white)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--muted)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'; }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '88%', padding: '0.75rem 1rem',
              background: m.role === 'user' ? `${color}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${m.role === 'user' ? `${scBorder(color, 30)}` : 'var(--card-border)'}`,
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)',
              lineHeight: 1.85, fontWeight: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>
              {m.content || (loading && i === messages.length - 1 ? <span style={{ color: 'var(--muted)' }}>▌</span> : '')}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
        <textarea
          ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder={`Ask about "${task.title}"… (Enter to send)`} rows={1}
          style={{ flex: 1, background: 'var(--black)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', padding: '0.6rem 0.85rem', outline: 'none', resize: 'none', lineHeight: 1.6, maxHeight: 96, overflowY: 'auto' }}
          onFocus={e => { e.target.style.borderColor = color; }}
          onBlur={e => { e.target.style.borderColor = 'var(--card-border)'; }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          background: input.trim() && !loading ? color : 'var(--card-border)', color: input.trim() && !loading ? 'var(--on-brand)' : 'var(--muted)',
          border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 700, padding: '0 1.25rem', transition: 'all 0.15s', flexShrink: 0,
        }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
