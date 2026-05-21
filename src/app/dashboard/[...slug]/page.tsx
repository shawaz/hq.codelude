const DESCRIPTIONS: Record<string, string> = {
  tasks:       'Assign, track, and close tasks across all ventures and teams.',
  events:      'Company calendar — meetings, milestones, and key dates.',
  news:        'Internal announcements and company-wide updates.',
  travels:     'Trip approvals, itineraries, and travel expense tracking.',
  files:       'Shared documents, decks, and assets across the organisation.',
  handbook:    'Company policies, processes, and culture documentation.',
  projects:    'All active projects across the four ventures with status tracking.',
  office:      'Office space management, hot-desking, and facilities.',
  departments: 'Organisational structure and department overviews.',
  brand:       'Brand guidelines, assets, logo kit, and tone of voice.',
  franchise:   'Franchiseen operations — partner onboarding and performance.',
  properties:  'Physical and digital asset registry across all ventures.',
  plan:        'Quarterly and annual planning documents and OKRs.',
  strategy:    'Long-term strategic roadmap across all four ventures.',
  partners:    'Strategic partner registry and relationship status.',
  activity:    'Cross-company activity feed and audit log.',
  channel:     'Communication channels — Slack, email, and external comms.',
  resources:   'Shared resources, tools, subscriptions, and access management.',
  relations:   'Stakeholder and investor relationship management.',
  budget:      'Operating budget per venture and at the HoldCo level.',
  accounts:    'Bank accounts, payment processors, and reconciliation.',
  wallets:     'Crypto wallets and on-chain treasury for Dubai HoldCo.',
  invoice:     'Outgoing invoices and billing management.',
  payee:       'Vendor and contractor payment tracking.',
  shares:      'Cap table, equity ledger, and HoldCo share registry.',
  investors:   'Token-based and equity fundraising tracker. Codelude raises via a Dubai HoldCo structure — investor allocations, token tranches, and venture-level round tracking live here.',
  attendance:  'Team attendance, leave requests, and working hours.',
  application: 'Job applications and candidate pipeline.',
  positions:   'Open roles and headcount planning across all ventures.',
  onboarding:  'New hire onboarding checklists and progress tracking.',
  users:       'Team member accounts, roles, and access permissions.',
  training:    'Learning paths, certifications, and skill development.',
  offboarding: 'Exit process management and access revocation.',
  nda:         'Non-disclosure agreement registry and status tracking.',
  contracts:   'All active contracts — vendors, partners, and clients.',
  govt:        'Government filings, licences, and regulatory compliance.',
  market:      'Market research, landscape analysis, and opportunity mapping.',
  competition: 'Competitor intelligence and differentiation tracking.',
  campaign:    'Marketing campaigns across all ventures — planning and results.',
  content:     'Content calendar, blog posts, and social media assets.',
  prospects:   'Top-of-funnel prospect list and outreach status.',
  leads:       'Qualified leads and discovery call tracking.',
  deals:       'Active deals and negotiation status.',
  clients:     'Active client accounts and relationship health.',
  platform:    'Internal software platforms and infrastructure overview.',
  features:    'Feature backlog and development roadmap.',
  bugs:        'Bug tracker — reported issues, severity, and resolution status.',
  tickets:     'Support tickets from clients and partners.',
  helpdesk:    'Help desk queue, response times, and resolution tracking.',
};

function toTitle(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const key = slug[slug.length - 1];
  const title = toTitle(key);
  const description = DESCRIPTIONS[key];

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)',
        letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        {title}
        <span style={{ flex: 1, height: 1, background: 'var(--card-border)', display: 'block' }} />
      </div>

      <h2 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
        {title}
      </h2>

      {description && (
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)',
          lineHeight: 1.9, fontWeight: 300, marginBottom: '2rem', maxWidth: 480,
        }}>
          {description}
        </p>
      )}

      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', gap: '1rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', padding: '0.2rem 0.65rem',
          border: '1px solid var(--card-border)', color: 'var(--muted)',
        }}>
          Coming soon
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', fontWeight: 300 }}>
          This module is being built.
        </span>
      </div>
    </div>
  );
}
