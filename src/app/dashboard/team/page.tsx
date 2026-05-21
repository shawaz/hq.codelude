import { getTeam } from '@/lib/users';

export default function TeamPage() {
  const team = getTeam();

  return (
    <div>
      <div className="team-grid">
        {team.map(member => (
          <div key={member.id} className="team-card">
            <div className="team-avatar">{member.name[0].toUpperCase()}</div>
            <div className="team-name">{member.name}</div>
            <div className="team-title">{member.title}</div>
            <div className="team-email">{member.email}</div>
            <span className={`team-role-badge${member.role === 'admin' ? ' admin' : ''}`}>
              {member.role}
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '1.5rem', lineHeight: 1.7 }}>
        To add team members, update <code style={{ color: 'var(--accent)' }}>TEAM_USERS</code> in <code style={{ color: 'var(--accent)' }}>.env.local</code> and restart the server.
      </p>
    </div>
  );
}
