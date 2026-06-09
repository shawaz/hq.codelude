import { WALLETS, type WalletStatus } from '@/lib/finance';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<WalletStatus, { color: string; label: string }> = {
  active:  { color: '#5DCAA5', label: 'Active'  },
  pending: { color: '#FAC775', label: 'Pending' },
  cold:    { color: '#85B7EB', label: 'Cold'    },
};

const CHAIN_COLORS: Record<string, string> = {
  Ethereum:    '#7F77DD',
  Polygon:     '#8b5cf6',
  Solana:      '#14F195',
  'BNB Chain': '#F0B90B',
  'Multi-chain': '#c8f53a',
};

export default function WalletsPage() {
  return (
    <div>
      <h1 className="page-title">Wallets</h1>
      <p className="page-sub">Dubai HoldCo crypto treasury — wallet registry, purpose, and deployment status.</p>
      <VentureTabs />

      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid #7F77DD', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: '#7F77DD', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Treasury policy</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
          All HoldCo wallets require <strong style={{ color: 'var(--off-white)' }}>multisig (2-of-3)</strong> before deployment. Treasury wallet deploys only after Dubai HoldCo is legally incorporated. Token issuance wallet requires a smart contract audit before any token is issued. Cold storage holds on a hardware wallet controlled by the founder only.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {WALLETS.map((w, i) => {
          const ss = STATUS_STYLES[w.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.4rem 1.5rem', display: 'grid', gridTemplateColumns: '200px 110px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>{w.label}</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', padding: '0.15rem 0.5rem', border: `1px solid ${CHAIN_COLORS[w.chain] || 'var(--card-border)'}40`, color: CHAIN_COLORS[w.chain] || 'var(--muted)' }}>{w.chain}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Balance</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: w.balance !== '$0' && w.balance !== 'N/A' ? '#5DCAA5' : 'var(--muted)' }}>{w.balance}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Address</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{w.address}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{w.purpose}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.7, marginTop: '0.4rem', lineHeight: 1.5 }}>{w.notes}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${ss.color}40`, color: ss.color, whiteSpace: 'nowrap' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
