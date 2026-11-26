'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

const categories = ['Getting started', 'Accounts & security', 'Brands & listings', 'Properties', 'Deals', 'Payments & documents', 'Troubleshooting'] as const;
type Article = {
  _id: Id<'supportArticles'>;
  title: string;
  slug: string;
  category: string;
  audience: string[];
  language: string;
  body: string;
  published: boolean;
  revision: number;
};
const slugify = (x: string) => x.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function HelpArticlesPage() {
  const articles = useQuery(api.support.listArticles, { venture: 'Codelude', includeDrafts: true });
  const save = useMutation(api.support.saveArticle);
  const publish = useMutation(api.support.setArticlePublished);
  const [selected, setSelected] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<typeof categories[number]>(categories[0]);
  const [language, setLanguage] = useState('en');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('marketplace_users');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function reset(article?: Article) {
    setSelected(article ?? null); setTitle(article?.title ?? ''); setSlug(article?.slug ?? ''); setCategory((article?.category as typeof categories[number]) ?? categories[0]); setLanguage(article?.language ?? 'en'); setBody(article?.body ?? ''); setAudience(article?.audience[0] ?? 'marketplace_users'); setError('');
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      await save({ id: selected?._id as Id<'supportArticles'> | undefined, expectedRevision: selected?.revision, title, slug: slug || slugify(title), category, audience: [audience], language, body });
      reset();
    } catch (err) { setError(err instanceof Error ? err.message : 'Could not save the article.'); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <Link href="/dashboard/helpdesk" style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>← Help Desk</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
        <div><h1 className="page-title">Help articles</h1><p className="page-sub">Write and publish marketplace guidance. Internal procedures belong in Handbook.</p></div>
        <button className="button" onClick={() => reset()}>New article</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px,0.8fr) minmax(360px,1.4fr)', gap: 18, marginTop: 20 }}>
        <section style={panel}><h2 style={h2}>Articles ({articles?.length ?? '…'})</h2>
          {(articles ?? []).map((a) => <button key={a._id} onClick={() => reset(a)} style={row}><strong>{a.title}</strong><span style={small}>{a.published ? 'Published' : 'Draft'} · {a.category}</span></button>)}
          {articles?.length === 0 && <p style={small}>No help articles yet. Add the first guide here.</p>}
        </section>
        <form onSubmit={submit} style={panel}>
          <h2 style={h2}>{selected ? 'Edit article' : 'New article'}</h2>
          {error && <p role="alert" style={{ color: '#ff9386' }}>{error}</p>}
          <label style={label}>Title<input required minLength={3} maxLength={140} value={title} onChange={(e) => { setTitle(e.target.value); if (!selected) setSlug(slugify(e.target.value)); }} style={input} /></label>
          <label style={label}>URL slug<input required value={slug} onChange={(e) => setSlug(slugify(e.target.value))} style={input} /></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <label style={label}>Category<select value={category} onChange={(e) => setCategory(e.target.value as typeof categories[number])} style={input}>{categories.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label style={label}>Language<input value={language} onChange={(e) => setLanguage(e.target.value)} maxLength={12} style={input} /></label>
          </div>
          <label style={label}>Audience<select value={audience} onChange={(e) => setAudience(e.target.value)} style={input}><option value="marketplace_users">Marketplace users</option><option value="brand_owners">Brand owners</option><option value="property_owners">Property owners</option><option value="franchisees">Franchisees</option></select></label>
          <label style={label}>Article body<textarea required minLength={20} maxLength={30000} rows={13} value={body} onChange={(e) => setBody(e.target.value)} style={{ ...input, resize: 'vertical' }} /></label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button className="button" disabled={busy}>{busy ? 'Saving…' : selected ? 'Save draft' : 'Create draft'}</button>
            {selected && <button type="button" className="button" disabled={busy} onClick={async () => { setBusy(true); setError(''); try { await publish({ id: selected._id as Id<'supportArticles'>, published: !selected.published, expectedRevision: selected.revision }); } catch (err) { setError(err instanceof Error ? err.message : 'Could not update publication.'); } finally { setBusy(false); } }}>{selected.published ? 'Unpublish' : 'Publish'}</button>}
            {selected && <button type="button" className="button" onClick={() => reset()}>Cancel</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

const panel: React.CSSProperties = { padding: '1.1rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)' };
const h2: React.CSSProperties = { margin: '0 0 1rem', color: 'var(--off-white)', fontSize: '1rem' };
const row: React.CSSProperties = { width: '100%', display: 'block', padding: '0.8rem 0', textAlign: 'left', background: 'transparent', color: 'var(--off-white)', border: 0, borderBottom: '1px solid var(--card-border)', cursor: 'pointer' };
const small: React.CSSProperties = { display: 'block', color: 'var(--muted)', fontSize: '0.68rem', marginTop: 4 };
const label: React.CSSProperties = { display: 'block', marginBottom: 12, color: 'var(--muted)', fontSize: '0.7rem' };
const input: React.CSSProperties = { display: 'block', boxSizing: 'border-box', width: '100%', marginTop: 4, padding: '0.6rem', background: 'var(--black)', color: 'var(--off-white)', border: '1px solid var(--card-border)' };
