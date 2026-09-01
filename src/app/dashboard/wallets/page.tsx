'use client';

import { WALLETS, forVenture, isHoldCo, type WalletStatus } from '@/lib/finance';
import VenturePageLayout, { NoRows, HoldCoTag, type VentureTab } from '@/components/VenturePageLayout';
import { sc, scBorder } from '@/lib/status-colors';

// Wallets have no natural second view, so the tab row splits by deployment status.
const TABS: VentureTab[] = [
  { key: 'all',     label: 'All'     },
  { key: 'active',  label: 'Active'  },
  { key: 'pending', label: 'Pending' },
  { key: 'cold',    label: 'Cold'    },
];

const STATUS_STYLES: Record<WalletStatus, { color: string; label: string }> = {
  active:  { color: '#dbdbdb', label: 'Active'  },
  pending: { color: '#b5b5b5', label: 'Pending' },
  cold:    { color: '#a5a5a5', label: 'Cold'    },
};

const CHAIN_COLORS: Record<string, string> = {
  Ethereum:    '#c8c8c8',
  Polygon:     '#8b5cf6',
  Solana:      '#14F195',
  'BNB Chain': '#F0B90B',
  'Multi-chain': '#eeeeee',
};

export default function WalletsPage() {
  return (
    <VenturePageLayout
      title="Wallets"
      subtitle="Dubai HoldCo crypto treasury — wallet registry, purpose, and deployment status."
      pageSlug="wallets"
      eyebrow={() => 'treasury'}
      heading={v => `${v.name} Wallets`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        const scoped = forVenture(WALLETS, venture.name);
        const rows = tab === 'all' ? scoped : scoped.filter(w => w.status === tab);
        return (
          <>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid #c8c8c8', padding: '1.25rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: sc('#c8c8c8'), letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Treasury policy</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>
          All HoldCo wallets require <strong style={{ color: 'var(--off-white)' }}>multisig (2-of-3)</strong> before deployment. Treasury wallet deploys only after Dubai HoldCo is legally incorporated. Token issuance wallet requires a smart contract audit before any token is issued. Cold storage holds on a hardware wallet controlled by the founder only.
        </p>
      </div>

      {rows.length === 0 ? <NoRows>No {tab === 'all' ? '' : `${tab} `}wallets for {venture.name}.</NoRows> : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {rows.map((w, i) => {
          const ss = STATUS_STYLES[w.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.4rem 1.5rem', display: 'grid', gridTemplateColumns: '200px 110px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                  {w.label}{isHoldCo(w) && <HoldCoTag />}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(CHAIN_COLORS[w.chain] || 'var(--card-border)')}`, color: CHAIN_COLORS[w.chain] || 'var(--muted)' }}>{w.chain}</span>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Balance</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: w.balance !== '$0' && w.balance !== 'N/A' ? '#dbdbdb' : 'var(--muted)' }}>{w.balance}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Address</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{w.address}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{w.purpose}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.7, marginTop: '0.4rem', lineHeight: 1.5 }}>{w.notes}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color), whiteSpace: 'nowrap' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
      )}
          </>
        );
      }}
    </VenturePageLayout>
  );
}
