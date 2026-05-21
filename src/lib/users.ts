export interface TeamUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'member';
  title: string;
}

function loadTeam(): TeamUser[] {
  try {
    return JSON.parse(process.env.TEAM_USERS || '[]');
  } catch {
    return [];
  }
}

export function findUser(email: string, password: string): TeamUser | null {
  const team = loadTeam();
  return team.find(u => u.email === email && u.password === password) ?? null;
}

export function getTeam(): Omit<TeamUser, 'password'>[] {
  return loadTeam().map(({ password: _, ...u }) => u);
}
