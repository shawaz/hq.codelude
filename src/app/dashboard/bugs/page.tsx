type Severity = 'high' | 'medium' | 'low';
type BugStatus = 'open' | 'fixed';

interface Bug {
  title: string;
  area: string;
  severity: Severity;
  status: BugStatus;
  detail: string;
  ref?: string;
}

interface PlatformBugs {
  platform: string;
  domain: string;
  color: string;
  bugs: Bug[];
}

/**
 * Manually reconciled from each platform's own repo — AGENTS.md session logs,
 * documented known gaps, and `fix:` commit history. Not live detection; the
 * agent described at the bottom of this page will replace this snapshot.
 * HubCV last reconciled 24 Aug 2026 against /Users/shawaz/Documents/hubcv @ 0faafdf.
 */
const DATA: PlatformBugs[] = [
  {
    platform: 'HubCV',
    domain: 'hubcv.pro',
    color: '#FAC775',
    bugs: [
      {
        title: 'campusOrgs / toCampus scan the whole organizations table',
        area: 'convex/orgs.ts',
        severity: 'high',
        status: 'open',
        detail: 'Whole-table collect() plus five count-subqueries per org. This is the directory-scale blocker: fine at demo size, unusable against 77k rows. The new viewport query deliberately bypasses it rather than fixing it, so any surface still calling campusOrgs carries the cost.',
      },
      {
        title: 'Map silently truncates when zoomed out',
        area: 'listDirectorySchoolsInBounds',
        severity: 'medium',
        status: 'open',
        detail: 'Convex has no geo index, so the viewport query enumerates the 0.1° cells a bounding box covers and range-scans by_geo_cell per cell. Past 900 cells / 1,200 rows it returns tooWide and stops plotting — correct by design, but the user just sees pins disappear.',
      },
      {
        title: 'Rooms cannot be created for postings with no roles',
        area: '/room/new',
        severity: 'medium',
        status: 'open',
        detail: 'canSubmit requires roleName, and the mutation throws "…or pick the role you\'re joining". Non-admin users hit a dead end on any posting that has no roles defined. Documented as intentional-ish but unresolved.',
      },
      {
        title: 'Production errors return a generic "Server Error"',
        area: 'Convex prod (savory-marmot-392)',
        severity: 'medium',
        status: 'open',
        detail: 'Prod hides error detail, so HTTP probes cannot distinguish a missing function from an auth failure. Dev separates them correctly, which means prod-only regressions must be reproduced on dev before they can be diagnosed.',
      },
      {
        title: '.env.production.local points at the dev deployment',
        area: 'env config',
        severity: 'medium',
        status: 'open',
        detail: 'Both CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL in .env.production.local resolve to dev jovial-anaconda-656, not prod savory-marmot-392. Harmless while Vercel supplies its own values at build time, but a local production build would silently target the dev database.',
      },
      {
        title: '1,477 schools display as "School <DISE code>"',
        area: 'Karnataka directory',
        severity: 'low',
        status: 'open',
        detail: 'Upstream data gap: 1.9% of DISE rows ship with an empty SCHOOL_NAME. Rendering the code is the honest fallback — names are not fabricated — but these rows look broken to users and cannot be searched by name.',
      },
      {
        title: 'Stale describeEntity type error in .next/dev/types',
        area: 'build tooling',
        severity: 'low',
        status: 'open',
        detail: 'Reproduces on a clean checkout, so it is a generated-types artefact rather than a source defect. Cleared with rm -rf .next/dev/types before building.',
      },
      {
        title: 'Follower counts were synthetic',
        area: 'convex/orgs.ts',
        severity: 'high',
        status: 'fixed',
        detail: 'Hub follower numbers came from a formula instead of real data. Replaced with a real orgFollows count.',
        ref: 'b1ae31e',
      },
      {
        title: 'Null capacity reported zero open slots',
        area: 'getCampusStats / statsForRoles',
        severity: 'high',
        status: 'fixed',
        detail: 'capacity == null evaluated to 0 open slots, so postings that were genuinely open looked full. Roles now default to capacity 1 and courses to 30.',
        ref: 'b134d4e',
      },
      {
        title: 'Hub owners could not open their own course rooms',
        area: 'convex/chat.ts',
        severity: 'high',
        status: 'fixed',
        detail: 'isRoomMember\'s Course branch ignored org-admin membership, unlike Event/Project/Job, so getRoom returned null and the page 404\'d. Root cause of the "cannot create or view Rooms" report.',
        ref: '49cae26',
      },
      {
        title: 'GeoNames collapsed Bengaluru onto a single point',
        area: 'geocoding pipeline',
        severity: 'high',
        status: 'fixed',
        detail: 'Every 560xxx pincode resolved to one shared coordinate ~28 km north of the real centre, misplacing ~5,600 schools. India Post\'s office directory is now the primary source with per-axis median aggregation; GeoNames is gap-fill only. Distinct points went 1,189 → 4,670.',
        ref: '688523e',
      },
    ],
  },
];

const SEVERITY: Record<Severity, { color: string; label: string }> = {
  high:   { color: '#ff8080', label: 'High'   },
  medium: { color: '#FAC775', label: 'Medium' },
  low:    { color: 'var(--muted)', label: 'Low'    },
};

const mono = (size: string): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: size,
});

export default function BugsPage() {
  const all = DATA.flatMap(p => p.bugs);
  const open = all.filter(b => b.status === 'open');
  const fixed = all.filter(b => b.status === 'fixed');
  const highOpen = open.filter(b => b.severity === 'high').length;

  return (
    <div>
      <h1 className="page-title">Bugs</h1>
      <p className="page-sub">Known issues and recent fixes across all platforms.</p>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)',
        border: '1px solid var(--card-border)', marginBottom: '2rem' }}>
        {[
          { label: 'Open',        value: open.length,  color: '#FAC775' },
          { label: 'High / open', value: highOpen,     color: highOpen > 0 ? '#ff8080' : '#5DCAA5' },
          { label: 'Fixed',       value: fixed.length, color: '#5DCAA5' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card-bg)', padding: '1.1rem 1.5rem', flex: 1 }}>
            <div style={{ ...mono('0.58rem'), color: 'var(--muted)', letterSpacing: '0.14em',
              textTransform: 'uppercase', marginBottom: '0.35rem' }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {DATA.map(group => (
        <div key={group.platform} style={{ marginBottom: '2.5rem' }}>
          <div style={{ borderLeft: `2px solid ${group.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{group.platform}</div>
            <div style={{ ...mono('0.62rem'), color: 'var(--muted)' }}>{group.domain}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px',
            background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {group.bugs.map(bug => {
              const sev = SEVERITY[bug.severity];
              const isFixed = bug.status === 'fixed';
              return (
                <div key={bug.title} style={{
                  background: 'var(--card-bg)', padding: '1.1rem 1.5rem',
                  display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.25rem',
                  alignItems: 'start', opacity: isFixed ? 0.62 : 1,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.3rem',
                      textDecoration: isFixed ? 'line-through' : 'none' }}>{bug.title}</div>
                    <div style={{ ...mono('0.58rem'), color: group.color, marginBottom: '0.5rem' }}>
                      {bug.area}{bug.ref && <span style={{ color: 'var(--muted)' }}> · {bug.ref}</span>}
                    </div>
                    <p style={{ ...mono('0.67rem'), color: 'var(--muted)', lineHeight: 1.75,
                      fontWeight: 300, margin: 0 }}>{bug.detail}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-end' }}>
                    <span style={{ ...mono('0.54rem'), letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '0.15rem 0.5rem', whiteSpace: 'nowrap',
                      border: `1px solid ${isFixed ? '#5DCAA5' : '#FAC775'}40`,
                      color: isFixed ? '#5DCAA5' : '#FAC775' }}>
                      {isFixed ? 'Fixed' : 'Open'}
                    </span>
                    <span style={{ ...mono('0.54rem'), letterSpacing: '0.12em', textTransform: 'uppercase',
                      padding: '0.15rem 0.5rem', whiteSpace: 'nowrap',
                      border: `1px solid ${sev.color}40`, color: sev.color }}>
                      {sev.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Planned automation */}
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderLeft: '2px solid var(--accent)', padding: '1.5rem 1.75rem', maxWidth: 720,
      }}>
        <div style={{ ...mono('0.6rem'), color: 'var(--accent-text)', letterSpacing: '0.18em',
          textTransform: 'uppercase', marginBottom: '0.6rem' }}>Planned — AI Agent</div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Autonomous bug agent</h2>
        <p style={{ ...mono('0.7rem'), color: 'var(--muted)', lineHeight: 1.85, fontWeight: 300, margin: 0 }}>
          The list above is a manual snapshot reconciled from each repo&apos;s session log and
          <code style={{ color: 'var(--accent-text)' }}> fix:</code> commit history. An agent will replace it —
          scanning live platforms for runtime errors, broken routes and failed API calls, logging them
          here with severity and reproduction steps, then proposing fixes as reviewable diffs.
        </p>
      </div>
    </div>
  );
}
