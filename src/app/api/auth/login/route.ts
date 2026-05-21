import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { SessionData, sessionOptions } from '@/lib/session';
import { findUser } from '@/lib/users';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const user = findUser(email, password);

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.isLoggedIn = true;
  session.userId = user.id;
  session.name = user.name;
  session.email = user.email;
  session.role = user.role;
  session.title = user.title;
  await session.save();

  return NextResponse.json({ ok: true });
}
