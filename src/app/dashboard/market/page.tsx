import { MARKETS } from '@/lib/mktg';
import VentureTabs from '@/components/VentureTabs';

export default function MarketPage() {
  return (
    <div>
      <h1 className="page-title">Market</h1>
      <p className="page-sub">Market sizing and key trends per venture — TAM, SAM, SOM, and strategic insight.</p>
      <VentureTabs />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {MARKETS.map((m, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: `2px solid ${m.color}`, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: m.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{m.venture}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{m.cagr}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1rem' }}>
              {[{ label: 'TAM', val: m.tam }, { label: 'SAM', val: m.sam }, { label: 'SOM (5yr target)', val: m.som }].map(cell => (
                <div key={cell.label} style={{ background: 'var(--black)', padding: '1rem 1.25rem' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{cell.label}</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: m.color, letterSpacing: '-0.01em' }}>{cell.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Key trend</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.7, fontWeight: 300 }}>{m.keyTrend}</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Our insight</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{m.insight}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
