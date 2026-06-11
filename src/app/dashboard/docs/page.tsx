'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { renderMarkdown, DOC_RENDER_CSS, DOC_PRINT_CSS, LETTERHEADS, type Letterhead } from '@/lib/markdown';

interface DocMeta { slug: string; title: string; updatedAt: string; size: number; }
interface ShareMeta {
  token: string; slug: string; recipientEmail: string; letterhead: Letterhead;
  createdAt: string; expiresAt: string; revoked: boolean; views: string[]; active: boolean;
}

const btn = (active?: boolean, c?: string): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '0.45rem 0.9rem',
  border: `1px solid ${active ? (c || 'var(--accent)') : 'var(--card-border)'}`,
  color: active ? (c || 'var(--accent)') : 'var(--muted)',
  background: 'transparent', cursor: 'pointer',
});

const modalShell: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 50,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem',
};

const modalBox: React.CSSProperties = {
  background: 'var(--black)', border: '1px solid var(--card-border)',
  padding: '1.75rem', width: 460, maxWidth: '100%', maxHeight: '85vh', overflowY: 'auto',
};

const fieldStyle: React.CSSProperties = {
  width: '100%', background: 'var(--card-bg)', border: '1px solid var(--card-border)',
  color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
  padding: '0.6rem 0.75rem', outline: 'none', boxSizing: 'border-box',
};

function LetterheadOptions({ value, onChange }: { value: Letterhead; onChange: (l: Letterhead) => void }) {
  const options: { id: Letterhead; label: string }[] = [
    { id: 'roborns', label: 'Roborns' },
    { id: 'codelude', label: 'Codelude' },
    { id: 'none', label: 'None' },
  ];
  return (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      {options.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{ ...btn(value === o.id), flex: 1 }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Hidden on screen; shown above the doc when printing (DOC_PRINT_CSS flips it on).
function PrintLetterhead({ letterhead }: { letterhead: Letterhead }) {
  if (letterhead === 'none') return null;
  const lh = LETTERHEADS[letterhead];
  return (
    <div className="letterhead" style={{
      display: 'none', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '2px solid #111', paddingBottom: '1rem', marginBottom: '2rem',
    }}>
      {lh.logoLight ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={lh.logoLight} alt={lh.name} style={{ height: 34 }} />
      ) : (
        <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.02em', color: '#111' }}>
          {lh.name.toUpperCase()}
        </span>
      )}
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#555', lineHeight: 1.8 }}>
        {lh.entity}<br />{lh.contact}
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [docs, setDocs]         = useState<DocMeta[]>([]);
  const [query, setQuery]       = useState('');
  const [slug, setSlug]         = useState<string | null>(null);
  const [content, setContent]   = useState('');
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState('');
  const [saving, setSaving]     = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading]   = useState(false);

  // PDF export
  const [pdfPicker, setPdfPicker]             = useState(false);
  const [printLetterhead, setPrintLetterhead] = useState<Letterhead>('none');

  // Sharing
  const [shareOpen, setShareOpen]             = useState(false);
  const [shares, setShares]                   = useState<ShareMeta[]>([]);
  const [sharedSlugs, setSharedSlugs]         = useState<Set<string>>(new Set());
  const [shareEmail, setShareEmail]           = useState('');
  const [shareLetterhead, setShareLetterhead] = useState<Letterhead>('roborns');
  const [shareBusy, setShareBusy]             = useState(false);
  const [shareMsg, setShareMsg]               = useState('');

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadList = useCallback(async (q: string) => {
    const res = await fetch(`/api/docs${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    if (res.ok) setDocs(await res.json());
  }, []);

  const loadSharedSlugs = useCallback(async () => {
    const res = await fetch('/api/docs/shares');
    if (!res.ok) return;
    const all: ShareMeta[] = await res.json();
    setSharedSlugs(new Set(all.filter(s => s.active).map(s => s.slug)));
  }, []);

  useEffect(() => { loadList(''); loadSharedSlugs(); }, [loadList, loadSharedSlugs]);

  // Debounced search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => loadList(query), 250);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [query, loadList]);

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
    loadList(query);
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
    await loadList(query);
    openDoc(s);
  }

  async function deleteDoc() {
    if (!slug || !confirm('Delete this document?')) return;
    await fetch(`/api/docs/${slug}`, { method: 'DELETE' });
    setSlug(null);
    setContent('');
    loadList(query);
  }

  const active = docs.find(d => d.slug === slug);

  function exportPdf(lh: Letterhead) {
    setPrintLetterhead(lh);
    setPdfPicker(false);
    // Let React paint the letterhead block before the print dialog freezes the page.
    setTimeout(() => {
      const prev = document.title;
      document.title = active?.title ?? 'document';
      window.print();
      document.title = prev;
    }, 60);
  }

  const loadShares = useCallback(async (s: string) => {
    const res = await fetch(`/api/docs/shares?slug=${encodeURIComponent(s)}`);
    if (res.ok) setShares(await res.json());
  }, []);

  function openShareModal() {
    if (!slug) return;
    setShareMsg('');
    setShareEmail('');
    setShareOpen(true);
    loadShares(slug);
  }

  async function createShare() {
    if (!slug || !shareEmail.trim()) return;
    setShareBusy(true);
    setShareMsg('');
    const res = await fetch('/api/docs/shares', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, email: shareEmail.trim(), letterhead: shareLetterhead, title: active?.title }),
    });
    const d = await res.json().catch(() => ({}));
    setShareBusy(false);
    if (!res.ok) { setShareMsg(d.error || 'Failed to create share.'); return; }
    setShareMsg(`Link sent to ${shareEmail.trim()}.`);
    setShareEmail('');
    loadShares(slug);
    loadSharedSlugs();
  }

  async function revokeShare(token: string) {
    if (!confirm('Revoke this link? The recipient will lose access.')) return;
    await fetch('/api/docs/shares', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    if (slug) loadShares(slug);
    loadSharedSlugs();
  }

  return (
    <div className="docs-shell" style={{ display: 'flex', gap: 0, height: 'calc(100vh - 7rem)', overflow: 'hidden', margin: '0 -2rem' }}>

      {/* LEFT: LIST */}
      <div className="docs-list" style={{ width: 260, flexShrink: 0, borderRight: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {docs.length} doc{docs.length !== 1 ? 's' : ''}
          </span>
          <button onClick={() => setCreating(true)} style={{ ...btn(false), padding: '0.3rem 0.6rem', fontSize: '0.58rem' }}>
            + New
          </button>
        </div>

        <div style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--card-border)' }}>
          <input
            placeholder="Search docs…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ ...fieldStyle, fontSize: '0.68rem', padding: '0.5rem 0.65rem' }}
          />
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
              style={{ ...fieldStyle, background: 'var(--black)', borderColor: 'var(--accent)', marginBottom: '0.5rem' }}
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
              {query ? <>No docs match &ldquo;{query}&rdquo;.</> : <>No documents yet.<br />Click + New to create one.</>}
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
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span>
                  {new Date(d.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}{Math.round(d.size / 1024 * 10) / 10}kb
                </span>
                {sharedSlugs.has(d.slug) && (
                  <span style={{ color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0 0.3rem', fontSize: '0.5rem', letterSpacing: '0.08em' }}>
                    SHARED
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: VIEWER / EDITOR */}
      <div className="docs-viewer" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!slug ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 2 }}>
              Select a document to read<br />or click <strong style={{ color: 'var(--off-white)' }}>+ New</strong> to create one
            </div>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="docs-toolbar" style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '45%' }}>
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
                    <button onClick={() => setPdfPicker(true)} style={btn(false)}>
                      PDF
                    </button>
                    <button onClick={openShareModal} style={btn(false)}>
                      Share
                    </button>
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
            <div className="docs-content" style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
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
                <div className="print-area" style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', maxWidth: 820 }}>
                  <PrintLetterhead letterhead={printLetterhead} />
                  <div className="doc-render" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* PDF letterhead picker */}
      {pdfPicker && (
        <div className="no-print" style={modalShell} onClick={() => setPdfPicker(false)}>
          <div style={{ ...modalBox, width: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Save as PDF
            </div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, marginBottom: '1rem' }}>
              Choose a letterhead — your browser&apos;s print dialog will open. Select
              &ldquo;Save as PDF&rdquo; as the destination.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button onClick={() => exportPdf('roborns')} style={btn(true)}>Roborns letterhead</button>
              <button onClick={() => exportPdf('codelude')} style={btn(true)}>Codelude letterhead</button>
              <button onClick={() => exportPdf('none')} style={btn(false)}>No letterhead</button>
            </div>
            <button onClick={() => setPdfPicker(false)} style={{ ...btn(false), width: '100%', marginTop: '0.75rem' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {shareOpen && (
        <div className="no-print" style={modalShell} onClick={() => setShareOpen(false)}>
          <div style={modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Share document
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.25rem' }}>{active?.title}</div>

            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, marginBottom: '0.85rem' }}>
              The recipient gets a secure link by email and verifies with a one-time code on every visit.
              Links expire after 7 days and can be revoked here anytime.
            </p>

            <input
              type="email"
              placeholder="recipient@company.com"
              value={shareEmail}
              onChange={e => setShareEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createShare()}
              style={{ ...fieldStyle, marginBottom: '0.6rem' }}
            />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0.4rem 0' }}>
              Letterhead
            </div>
            <LetterheadOptions value={shareLetterhead} onChange={setShareLetterhead} />
            <button onClick={createShare} disabled={shareBusy} style={{ ...btn(true), width: '100%', marginTop: '0.85rem', padding: '0.6rem' }}>
              {shareBusy ? 'Sending…' : 'Send secure link'}
            </button>

            {shareMsg && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: shareMsg.startsWith('Link sent') ? '#5DCAA5' : '#ff8080', marginTop: '0.75rem' }}>
                {shareMsg}
              </p>
            )}

            {shares.length > 0 && (
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Existing links
                </div>
                {shares.map(s => (
                  <div key={s.token} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 0', borderBottom: '1px solid var(--card-border)' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--off-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.recipientEmail}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)' }}>
                        {s.active
                          ? <>expires {new Date(s.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</>
                          : (s.revoked ? 'revoked' : 'expired')}
                        {' · '}{s.views.length} view{s.views.length !== 1 ? 's' : ''}
                        {s.views.length > 0 && <> · last {new Date(s.views[s.views.length - 1]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</>}
                      </div>
                    </div>
                    {s.active && (
                      <button onClick={() => revokeShare(s.token)} style={{ ...btn(false), color: '#ff8080', borderColor: '#ff808040', padding: '0.25rem 0.55rem', fontSize: '0.55rem', flexShrink: 0 }}>
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setShareOpen(false)} style={{ ...btn(false), width: '100%', marginTop: '1rem' }}>
              Close
            </button>
          </div>
        </div>
      )}

      <style>{DOC_RENDER_CSS}</style>
      <style>{DOC_PRINT_CSS}</style>
      <style>{`
        @media print {
          .hq-main { margin-left: 0 !important; }
          .hq-content { padding: 0 !important; }
          .docs-shell { margin: 0 !important; height: auto !important; overflow: visible !important; display: block !important; }
          .docs-list, .docs-toolbar { display: none !important; }
          .docs-viewer, .docs-content { overflow: visible !important; display: block !important; }
          .print-area { max-width: none !important; }
        }
      `}</style>
    </div>
  );
}
