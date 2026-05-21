import type { SessionOptions } from 'iron-session';

export interface SessionData {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  title?: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  cookieName: 'hq_session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  },
};
