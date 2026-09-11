import { ONBOARDING_TEMPLATE } from '@/lib/people';
import { scBorder } from '@/lib/status-colors';

const CAT_COLORS: Record<string, string> = { Admin: '#c8c8c8', Culture: '#eeeeee', Work: '#dbdbdb' };

export default function OnboardingPage() {
  return (
    <div>
      <h1 className="page-title">Onboarding</h1>
      <p className="page-sub">Standard onboarding checklist for all new Codelude team members.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {ONBOARDING_TEMPLATE.map((step, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', borderLeft: `2px solid ${CAT_COLORS[step.category] || 'var(--accent)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: CAT_COLORS[step.category] || 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{step.day}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{step.title}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${scBorder(CAT_COLORS[step.category] || 'var(--accent)')}`, color: CAT_COLORS[step.category] || 'var(--accent)' }}>{step.category}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {step.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--card-border)', flexShrink: 0, paddingTop: '0.1rem' }}>☐</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
