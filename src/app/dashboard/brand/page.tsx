import { BRAND } from '@/lib/mktg';

export default function BrandPage() {
  return (
    <div>
      <h1 className="page-title">Brand</h1>
      <p className="page-sub">Codelude brand guidelines — typography, colour, venture palette, and voice.</p>

      {/* Typography */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Typography</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        {BRAND.fonts.map((f, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.75rem' }}>
            <div style={{ fontSize: i === 0 ? '2rem' : '1.4rem', fontWeight: 700, fontFamily: i === 0 ? "'Outfit', sans-serif" : "'DM Mono', monospace", marginBottom: '0.75rem', letterSpacing: i === 0 ? '-0.02em' : '0' }}>
              {f.name}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '0.35rem' }}>Weight: {f.weight}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', marginBottom: '0.35rem' }}>{f.role}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.usage}</div>
          </div>
        ))}
      </div>

      {/* Colours */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Colour system</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        {BRAND.colors.map((c, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '0.9rem 1.25rem', display: 'grid', gridTemplateColumns: '32px 120px 120px 1fr', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, background: c.value, border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }} />
            <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>{c.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{c.value}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', fontWeight: 300 }}>{c.usage}</span>
          </div>
        ))}
      </div>

      {/* Venture colours */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Venture palette</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        {BRAND.ventureColors.map((v, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.5rem 1.25rem' }}>
            <div style={{ height: 4, background: v.color, marginBottom: '1rem' }} />
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem', color: v.color }}>{v.venture}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', marginBottom: '0.3rem' }}>{v.color}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.5, opacity: 0.7 }}>{v.type}</div>
          </div>
        ))}
      </div>

      {/* Voice */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>Brand voice</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {BRAND.voice.map((v, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.6rem' }}>{v.principle}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>{v.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
