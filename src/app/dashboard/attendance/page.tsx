export default function AttendancePage() {
  const team = [{ name: 'Shawaz', role: 'Founder & CEO', location: 'Mangaluru', timezone: 'IST (UTC+5:30)' }];
  return (
    <div>
      <h1 className="page-title">Attendance</h1>
      <p className="page-sub">Team attendance, leave, and working hours. Scales when team grows.</p>
      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderLeft: '2px solid var(--accent)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Note — solo founder stage</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>Attendance tracking is structural at this stage. Full time-logging, leave management, and shift planning activate when the team reaches 3+ members. For now, the focus is on output — one meaningful action per venture per day.</p>
      </div>
      <table className="tasks-table">
        <thead><tr><th>Name</th><th>Role</th><th>Location</th><th>Timezone</th><th>Status</th></tr></thead>
        <tbody>
          {team.map((m, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, fontSize: '0.82rem' }}>{m.name}</td>
              <td><span className="category-label">{m.role}</span></td>
              <td><span className="category-label">{m.location}</span></td>
              <td><span className="category-label">{m.timezone}</span></td>
              <td><span className="status-badge" style={{ color: '#5DCAA5', borderColor: 'rgba(93,202,165,0.3)' }}>Active</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
