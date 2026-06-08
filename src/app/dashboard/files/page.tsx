'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FILES } from '@/lib/workspace';
import { UPLOAD_CATEGORIES, VENTURES, FILE_DEPARTMENTS, type UploadedFile } from '@/lib/files-upload-types';

const STATIC_VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B',
};

const FORMAT_COLORS: Record<string, string> = {
  HTML: '#F0997B', PDF: '#ff8080', XLSX: '#5DCAA5', PPTX: '#7F77DD',
  DOCX: '#85B7EB', Figma: '#c8f53a', MD: '#FAC775', 'PNG/SVG': '#7a7870',
};

const DEPT_COLORS: Record<string, string> = {
  Home: '#7a7870', Management: '#F0997B', Operations: '#5DCAA5',
  Finance: '#5DCAA5', People: '#85B7EB', Legal: '#F0997B',
  Marketing: '#c8f53a', Sales: '#FAC775', Software: '#7F77DD',
  Support: '#85B7EB',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function allPages(): string[] {
  const set = new Set<string>();
  FILE_DEPARTMENTS.forEach(d => d.pages.forEach(p => set.add(p)));
  return [...set].sort();
}

export default function FilesPage() {
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [pageFilter, setPageFilter] = useState<string>('all');
  const [venture,     setVenture]   = useState('All');

  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [dragOver, setDragOver] = useState(false);
  const [dropFile, setDropFile] = useState<File | null>(null);
  const [uv, setUv] = useState('Codelude');
  const [ud, setUd] = useState(FILE_DEPARTMENTS[0].dept);
  const [uc, setUc] = useState(FILE_DEPARTMENTS[0].pages[0]);
  const [un, setUn] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Note editor state
  const [showNote, setShowNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteDraft, setNoteDraft] = useState('');
  const [noteV, setNoteV] = useState('Codelude');
  const [noteD, setNoteD] = useState(FILE_DEPARTMENTS[0].dept);
  const [noteC, setNoteC] = useState(FILE_DEPARTMENTS[0].pages[0]);
  const [noteSaving, setNoteSaving] = useState(false);

  // Pages for currently selected department
  const currentPages = FILE_DEPARTMENTS.find(d => d.dept === ud)?.pages ?? FILE_DEPARTMENTS[0].pages;
  const notePages = FILE_DEPARTMENTS.find(d => d.dept === noteD)?.pages ?? FILE_DEPARTMENTS[0].pages;

  // Load uploaded files on mount
  useEffect(() => {
    fetch('/api/files/manifest')
      .then(r => r.json())
      .then(data => { if (data.files) setUploaded(data.files); })
      .catch(() => {});
  }, []);

  // Combined files
  const allFiles = [
    ...uploaded.map(f => ({
      _type: 'uploaded' as const,
      ...f,
      status: 'final' as const,
      version: '',
      location: `/api/files/${f.id}`,
      notes_display: f.notes || `${formatFileSize(f.size)} · uploaded`,
      // Map old flat category to a department if not set
      dept: f.department || 'Home',
      page: f.category || 'Files',
    })),
    ...FILES.map(f => ({
      _type: 'static' as const,
      id: f.id,
      name: f.name,
      venture: f.venture,
      category: f.category,
      format: f.format,
      version: f.version,
      date: f.date,
      location: f.location,
      status: f.status,
      notes_display: f.notes,
      // Infer department from category for static files
      dept: (() => {
        for (const d of FILE_DEPARTMENTS) {
          if (d.pages.includes(f.category)) return d.dept;
        }
        return 'Home';
      })(),
      page: f.category,
    })),
  ];

  // Dept+page filter
  const filtered = allFiles.filter(f =>
    (deptFilter === 'all' || f.dept === deptFilter) &&
    (pageFilter === 'all' || f.page === pageFilter) &&
    (venture === 'All' || f.venture === venture)
  );

  // Group by department for display
  const grouped: { dept: string; files: typeof filtered }[] = [];
  for (const f of filtered) {
    let g = grouped.find(g => g.dept === f.dept);
    if (!g) { g = { dept: f.dept, files: [] }; grouped.push(g); }
    g.files.push(f);
  }

  const total = allFiles.length;

  // ── Drag handlers ─────────────────────────────────────────────
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); }, []);
  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) setDropFile(file); }, []);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) setDropFile(file); }, []);
  const clearDrop = useCallback(() => { setDropFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }, []);

  // ── Upload ────────────────────────────────────────────────────
  const handleUpload = useCallback(async () => {
    if (!dropFile || uploading) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', dropFile);
      fd.append('venture', uv);
      fd.append('department', ud);
      fd.append('category', uc);
      fd.append('notes', un);

      const res = await fetch('/api/files/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success && data.file) {
        const newFile: UploadedFile = {
          id: data.file.id,
          name: data.file.name,
          originalName: data.file.name,
          venture: data.file.venture,
          department: data.file.department || ud,
          category: data.file.category || uc,
          format: data.file.format,
          size: data.file.size,
          date: data.file.date,
          notes: data.file.notes,
          mimeType: '',
          storagePath: '',
        };
        setUploaded(prev => [newFile, ...prev]);
        setShowUpload(false);
        clearDrop();
        setUn('');
      } else {
        alert('Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  }, [dropFile, uv, ud, uc, un, uploading, clearDrop]);

  // ── Save note as .md ──────────────────────────────────────────
  const handleSaveNote = useCallback(async () => {
    if (!noteTitle.trim() || noteSaving) return;
    setNoteSaving(true);
    try {
      const mdContent = noteContent || noteDraft || `# ${noteTitle}\n\n_New note created ${new Date().toISOString().split('T')[0]}_`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const safeTitle = noteTitle.trim().replace(/[^a-zA-Z0-9 _-]/g, '').replace(/\s+/g, '_') || 'untitled';
      const file = new File([blob], `${safeTitle}.md`, { type: 'text/markdown' });

      const fd = new FormData();
      fd.append('file', file);
      fd.append('venture', noteV);
      fd.append('department', noteD);
      fd.append('category', noteC);
      fd.append('notes', `Plan / notes — ${noteTitle}`);

      const res = await fetch('/api/files/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (data.success && data.file) {
        const newFile: UploadedFile = {
          id: data.file.id,
          name: data.file.name,
          originalName: data.file.name,
          venture: data.file.venture,
          department: data.file.department || noteD,
          category: data.file.category || noteC,
          format: 'MD',
          size: data.file.size,
          date: data.file.date,
          notes: data.file.notes,
          mimeType: '',
          storagePath: '',
        };
        setUploaded(prev => [newFile, ...prev]);
        setShowNote(false);
        setNoteTitle('');
        setNoteContent('');
        setNoteDraft('');
      } else {
        alert('Failed to save note: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Note save error: ' + err.message);
    } finally {
      setNoteSaving(false);
    }
  }, [noteTitle, noteContent, noteDraft, noteV, noteD, noteC, noteSaving]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">Files</h1>
          <p className="page-sub">Documents, decks, models, notes — organised by department.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => { setShowNote(v => !v); if (!showNote) setShowUpload(false); }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.5rem 1rem', border: `1px solid ${showNote ? '#FAC775' : 'var(--card-border)'}`,
              color: showNote ? '#FAC775' : 'var(--off-white)', background: showNote ? '#FAC77515' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{showNote ? '− Cancel' : '+ New Note'}</button>
          <button onClick={() => { setShowUpload(v => !v); if (!showUpload) setShowNote(false); }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '0.5rem 1rem', border: `1px solid ${showUpload ? 'var(--accent)' : 'var(--card-border)'}`,
              color: showUpload ? 'var(--accent)' : 'var(--off-white)', background: showUpload ? 'var(--accent)15' : 'transparent',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>{showUpload ? '− Cancel' : '+ Upload'}</button>
        </div>
      </div>

      {/* ── Note Panel ──────────────────────────────────────────── */}
      {showNote && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FAC775', marginBottom: '0.25rem' }}>✏ New Plan / Note</div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Title</label>
              <input type="text" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="e.g. Roborns Q3 Engineering Plan"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 140 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Venture</label>
              <select value={noteV} onChange={e => setNoteV(e.target.value)}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none' }}>
                {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 140 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Department</label>
              <select value={noteD} onChange={e => { setNoteD(e.target.value); setNoteC(FILE_DEPARTMENTS.find(d => d.dept === e.target.value)?.pages[0] || ''); }}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none' }}>
                {FILE_DEPARTMENTS.map(d => <option key={d.dept} value={d.dept}>{d.dept}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 140 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Category</label>
              <select value={noteC} onChange={e => setNoteC(e.target.value)}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none' }}>
                {notePages.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Content (markdown)</label>
            <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} rows={5} placeholder="Write your plan, notes, or document here… Supports markdown."
              style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.6rem', outline: 'none', resize: 'vertical', lineHeight: 1.7 }} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowNote(false)}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '0.45rem 1rem', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer' }}>Cancel</button>
            <button onClick={handleSaveNote} disabled={!noteTitle.trim() || noteSaving}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.45rem 1.25rem', border: 'none',
                background: noteTitle.trim() && !noteSaving ? '#FAC775' : 'var(--card-border)', color: noteTitle.trim() && !noteSaving ? 'var(--black)' : 'var(--muted)', cursor: noteTitle.trim() && !noteSaving ? 'pointer' : 'default' }}>
              {noteSaving ? 'Saving…' : 'Save Note'}
            </button>
          </div>
        </div>
      )}

      {/* ── Upload Panel ────────────────────────────────────────── */}
      {showUpload && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.25rem' }}>📁 Upload File</div>
          <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--card-border)'}`, background: dragOver ? 'var(--accent)08' : 'transparent', padding: '2.5rem 1.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
            {dropFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)' }}>✓</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--off-white)' }}>{dropFile.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)' }}>({formatFileSize(dropFile.size)})</span>
                <button onClick={(e) => { e.stopPropagation(); clearDrop(); }}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#ff8080', background: 'none', border: '1px solid #ff808040', padding: '0.15rem 0.5rem', cursor: 'pointer' }}>Remove</button>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>📁</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>Drag & drop a file here, or <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>click to browse</span></div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', marginTop: '0.3rem' }}>Max 50MB</div>
              </div>
            )}
            <input ref={fileInputRef} type="file" onChange={onFileSelect} style={{ display: 'none' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 140 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Venture</label>
              <select value={uv} onChange={e => setUv(e.target.value)}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none' }}>
                {VENTURES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 140 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Department</label>
              <select value={ud} onChange={e => { setUd(e.target.value); setUc((FILE_DEPARTMENTS.find(d => d.dept === e.target.value)?.pages ?? FILE_DEPARTMENTS[0].pages)[0]); }}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none' }}>
                {FILE_DEPARTMENTS.map(d => <option key={d.dept} value={d.dept}>{d.dept}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', minWidth: 140 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Category</label>
              <select value={uc} onChange={e => setUc(e.target.value)}
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none' }}>
                {currentPages.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: 200 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Notes (optional)</label>
              <input type="text" value={un} onChange={e => setUn(e.target.value)} placeholder="e.g. Investor deck v2, draft"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--off-white)', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '0.45rem 0.6rem', outline: 'none', width: '100%' }} />
            </div>
            <button onClick={handleUpload} disabled={!dropFile || uploading}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.45rem 1.25rem', border: 'none',
                background: dropFile && !uploading ? 'var(--accent)' : 'var(--card-border)', color: dropFile && !uploading ? 'var(--black)' : 'var(--muted)', cursor: dropFile && !uploading ? 'pointer' : 'default' }}>
              {uploading ? 'Uploading…' : 'Upload'}</button>
          </div>
        </div>
      )}

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
        {[{ label: 'Total', val: total, color: 'var(--off-white)' },
          { label: 'Uploaded', val: uploaded.length, color: 'var(--accent)' },
          { label: 'Notes', val: allFiles.filter(f => f.format === 'MD').length, color: '#FAC775' },
          { label: 'Reference', val: allFiles.filter(f => f._type === 'static').length, color: 'var(--muted)' }]
          .map(c => (
            <div key={c.label} className="tasks-count-cell">
              <div className="tasks-count-num" style={{ color: c.color }}>{c.val}</div>
              <div className="tasks-count-label">{c.label}</div>
            </div>
          ))}
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        {['All', ...VENTURES].map(v => (
          <button key={v} className={`filter-pill${venture === v ? ' active' : ''}`}
            style={venture === v && v !== 'All' ? { borderColor: STATIC_VENTURE_COLORS[v], color: STATIC_VENTURE_COLORS[v] } : {}}
            onClick={() => setVenture(v)}>{v}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '0.4rem' }}>
        <button className={`filter-pill${deptFilter === 'all' ? ' active' : ''}`} onClick={() => { setDeptFilter('all'); setPageFilter('all'); }}>All depts</button>
        {FILE_DEPARTMENTS.map(d => (
          <button key={d.dept} className={`filter-pill${deptFilter === d.dept ? ' active' : ''}`}
            style={deptFilter === d.dept ? { borderColor: DEPT_COLORS[d.dept] || 'var(--accent)', color: DEPT_COLORS[d.dept] || 'var(--accent)' } : {}}
            onClick={() => { setDeptFilter(d.dept); setPageFilter('all'); }}>{d.dept}</button>
        ))}
      </div>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-pill${pageFilter === 'all' ? ' active' : ''}`} onClick={() => setPageFilter('all')}>All pages</button>
        {(deptFilter === 'all' ? allPages() : (FILE_DEPARTMENTS.find(d => d.dept === deptFilter)?.pages ?? [])).map(p => (
          <button key={p} className={`filter-pill${pageFilter === p ? ' active' : ''}`}
            style={pageFilter === p ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
            onClick={() => setPageFilter(p)}>{p}</button>
        ))}
      </div>

      {/* ── File table (grouped by dept) ────────────────────────── */}
      {grouped.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
          No files match the current filter.
        </div>
      )}

      {grouped.map(group => {
        const deptColor = DEPT_COLORS[group.dept] || 'var(--muted)';
        return (
          <div key={group.dept} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', padding: '0.5rem 0', borderBottom: `1px solid ${deptColor}20` }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: deptColor, fontWeight: 600 }}>{group.dept}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)' }}>({group.files.length})</span>
              <span style={{ flex: 1, height: 1, background: `${deptColor}15`, display: 'block' }} />
            </div>

            {group.files.map(f => {
              const fmtColor = FORMAT_COLORS[f.format] || 'var(--muted)';
              const ventureColor = STATIC_VENTURE_COLORS[f.venture] || 'var(--muted)';
              const isUploaded = f._type === 'uploaded';
              const isNote = isUploaded && f.format === 'MD';

              const fileName = isUploaded
                ? <a href={f.location} target="_blank" rel="noopener noreferrer"
                     style={{ color: isNote ? '#FAC775' : 'var(--accent)', textDecoration: 'none' }}
                     onMouseEnter={e => { (e.target as HTMLElement).style.textDecoration = 'underline'; }}
                     onMouseLeave={e => { (e.target as HTMLElement).style.textDecoration = 'none'; }}>{f.name}</a>
                : <span style={{ color: 'var(--off-white)' }}>{f.name}</span>;

              const pageBadge = <span className="category-label" style={{ color: deptColor }}>{f.page}</span>;

              const badge = isUploaded
                ? <span className="category-label" style={{ color: isNote ? '#FAC775' : 'var(--accent)' }}>{isNote ? 'note' : 'uploaded'}</span>
                : <span className="category-label">{f.version}</span>;

              return (
                <div key={`${f._type}-${f.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.55rem 0.75rem', borderBottom: '1px solid var(--card-border)',
                  background: isNote ? '#FAC77504' : isUploaded ? 'var(--accent)04' : 'transparent',
                }}>
                  {/* Icon */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', flexShrink: 0, width: 24, textAlign: 'center', color: fmtColor }}>
                    {isNote ? '📝' : f.format === 'MD' ? '📄' : f.format === 'PDF' ? '📕' : f.format === 'XLSX' ? '📊' : f.format === 'PPTX' ? '📽' : f.format === 'PNG/SVG' ? '🖼' : f.format === 'HTML' ? '🌐' : '📎'}
                  </span>

                  {/* Name */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)', lineHeight: 1.4, fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {fileName}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--muted)', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {f.notes_display}
                    </div>
                  </div>

                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.1rem 0.35rem', border: `1px solid ${ventureColor}30`, color: ventureColor }}>{f.venture}</span>
                    {pageBadge}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', padding: '0.1rem 0.35rem', border: `1px solid ${fmtColor}30`, color: fmtColor }}>{f.format}</span>
                    {badge}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--muted)' }}>{f.date}</span>
                    {isUploaded && (
                      <a href={f.location} target="_blank" rel="noopener noreferrer"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--accent)', textDecoration: 'none', marginLeft: '0.25rem' }}>⬇</a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
