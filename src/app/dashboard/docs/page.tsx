'use client';

import { useState, useEffect, useCallback } from 'react';

interface DocMeta { slug: string; title: string; updatedAt: string; size: number; }

function renderMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---\n?/, '')
    .replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^---$/gm, '<hr />')
    .replace(/```([\s\S]*?)```/g, (_, inner) => {
      const body = inner.replace(/^\w+\n/, '');
      return `<pre><code>${body.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
    })
    .replace(/^\|(.+)\|$/gm, (row) => {
      const cells = row.slice(1, -1).split('|').map((c: string) => c.trim());
      return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>.*?<\/tr>\n?)+/gs, (block: string) => {
      const rows = block.trim().split('\n');
      const [header, , ...body] = rows;
      if (!header) return block;
      const headerHtml = header.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      return `<table><thead>${headerHtml}</thead><tbody>${body.join('')}</tbody></table>`;
    })
    .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="ol">$2</li>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li[^>]*>.*?<\/li>\n?)+/gs, (m: string) => `<ul>${m}</ul>`)
    .replace(/^(?!<[hultpodre]).+$/gm, (m: string) => m.trim() ? `<p>${m}</p>` : '')
    .replace(/\n{2,}/g, '\n');
}

const btn = (active?: boolean, c?: string): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '0.45rem 0.9rem',
  border: `1px solid ${active ? (c || 'var(--accent)') : 'var(--card-border)'}`,
  color: active ? (c || 'var(--accent)') : 'var(--muted)',
  background: 'transparent', cursor: 'pointer',
});

export default function DocsPage() {
  const [docs, setDocs]         = useState<DocMeta[]>([]);
  const [slug, setSlug]         = useState<string | null>(null);
  const [content, setContent]   = useState('');
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading]   = useState(false);

  const loadList = useCallback(async () => {
    const res = await fetch('/api/docs');
    if (res.ok) setDocs(await res.json());
  }, []);

  useEffect(() => { loadList(); }, [loadList]);

  async function openDoc(s: string) {
    setLoading(true);
    setSlug(s);
    setEditing(false);
    const res = await fetch(`/api/docs/${s}`);
    const data = await res.json();
    setContent(data.content);
    setDraft(data.content);
    setLoading(false);
  }

  async function save() {
    if (!slug) return;
    setSaving(true);
    await fetch(`/api/docs/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: draft }),
    });
    setContent(draft);
    setEditing(false);
    setSaving(false);
    loadList();
  }

  async function createDoc() {
    if (!newTitle.trim()) return;
    const s = newTitle.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    await fetch('/api/docs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: s, content: `# ${newTitle.trim()}\n\n` }),
    });
    setCreating(false);
    setNewTitle('');
    await loadList();
    openDoc(s);
  }

  async function deleteDoc() {
    if (!slug || !confirm('Delete this document?')) return;
    await fetch(`/api/docs/${slug}`, { method: 'DELETE' });
    setSlug(null);
    setContent('');
    loadList();
  }

  const active = docs.find(d => d.slug === slug);

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 7rem)', overflow: 'hidden', margin: '0 -2rem' }}>

      {/* LEFT: LIST */}
      <div style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {docs.length} doc{docs.length !== 1 ? 's' : ''}
          </span>
          <button onClick={() => setCreating(true)} style={{ ...btn(false), padding: '0.3rem 0.6rem', fontSize: '0.58rem' }}>
            + New
          </button>
        </div>

        {creating && (
          <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
            <input
              autoFocus
              placeholder="Document title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') createDoc();
                if (e.key === 'Escape') { setCreating(false); setNewTitle(''); }
              }}
              style={{
                width: '100%', background: 'var(--black)', border: '1px solid var(--accent)',
                color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
                padding: '0.5rem 0.65rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.5rem',
              }}
            />
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={createDoc} style={{ ...btn(true), fontSize: '0.55rem', padding: '0.3rem 0.6rem' }}>Create</button>
              <button onClick={() => { setCreating(false); setNewTitle(''); }} style={{ ...btn(false), fontSize: '0.55rem', padding: '0.3rem 0.6rem' }}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {docs.length === 0 ? (
            <div style={{ padding: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.9 }}>
              No documents yet.<br />Click + New to create one.
            </div>
          ) : docs.map(d => (
            <button
              key={d.slug}
              onClick={() => openDoc(d.slug)}
              style={{
                width: '100%', textAlign: 'left', padding: '0.85rem 1rem',
                background: slug === d.slug ? 'var(--card-bg)' : 'transparent',
                borderLeft: slug === d.slug ? '2px solid var(--accent)' : '2px solid transparent',
                border: 'none', borderBottom: '1px solid var(--card-border)', cursor: 'pointer', display: 'block',
              }}
            >
              <div style={{ fontWeight: slug === d.slug ? 600 : 400, fontSize: '0.78rem', marginBottom: '0.25rem', color: 'var(--off-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.title}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>
                {new Date(d.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                {' · '}{Math.round(d.size / 1024 * 10) / 10}kb
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: VIEWER / EDITOR */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!slug ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 2 }}>
              Select a document to read<br />or click <strong style={{ color: 'var(--off-white)' }}>+ New</strong> to create one
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '55%' }}>
                {active?.title}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {editing ? (
                  <>
                    <button onClick={save} disabled={saving} style={{ ...btn(true, '#5DCAA5'), color: '#5DCAA5', borderColor: '#5DCAA5' }}>
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => { setEditing(false); setDraft(content); }} style={btn(false)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(true); setDraft(content); }} style={btn(false)}>
                      Edit
                    </button>
                    <button onClick={deleteDoc} style={{ ...btn(false), color: '#ff8080', borderColor: '#ff808040' }}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              {loading ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
                  Loading…
                </div>
              ) : editing ? (
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  style={{
                    flex: 1, width: '100%', background: 'var(--black)', color: 'var(--off-white)',
                    border: 'none', outline: 'none', padding: '1.75rem 2rem',
                    fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.85,
                    resize: 'none', boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div
                  className="doc-render"
                  style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', maxWidth: 820 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
                />
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .doc-render h1 { font-size: 1.55rem; font-weight: 800; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
        .doc-render h2 { font-size: 1.1rem; font-weight: 700; margin: 2rem 0 0.65rem; letter-spacing: -0.01em; border-bottom: 1px solid var(--card-border); padding-bottom: 0.35rem; }
        .doc-render h3 { font-size: 0.9rem; font-weight: 700; margin: 1.4rem 0 0.45rem; color: var(--accent); }
        .doc-render p  { fontFamily: 'var(--font-mono)'; font-size: 0.78rem; line-height: 1.9; color: var(--muted); margin: 0 0 0.7rem; font-weight: 300; }
        .doc-render strong { color: var(--off-white); font-weight: 700; }
        .doc-render em { color: var(--off-white); font-style: italic; }
        .doc-render code { font-family: var(--font-mono); font-size: 0.72rem; background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.1rem 0.35rem; color: var(--accent); }
        .doc-render pre  { background: var(--card-bg); border: 1px solid var(--card-border); padding: 1rem 1.25rem; margin: 1rem 0; overflow-x: auto; }
        .doc-render pre code { background: none; border: none; padding: 0; font-size: 0.7rem; color: var(--off-white); line-height: 1.75; white-space: pre; }
        .doc-render table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-family: var(--font-mono); font-size: 0.68rem; }
        .doc-render th { background: var(--card-bg); border: 1px solid var(--card-border); padding: 0.45rem 0.75rem; text-align: left; color: var(--off-white); font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; font-size: 0.58rem; }
        .doc-render td { border: 1px solid var(--card-border); padding: 0.45rem 0.75rem; color: var(--muted); font-weight: 300; line-height: 1.5; vertical-align: top; }
        .doc-render tr:hover td { background: var(--card-bg); }
        .doc-render ul { margin: 0.4rem 0 0.9rem 1.25rem; }
        .doc-render li { font-family: var(--font-mono); font-size: 0.75rem; color: var(--muted); line-height: 1.85; font-weight: 300; }
        .doc-render hr { border: none; border-top: 1px solid var(--card-border); margin: 1.5rem 0; }
      `}</style>
    </div>
  );
}
