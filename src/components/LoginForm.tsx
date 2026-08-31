'use client';

import { useState } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';

export default function LoginForm() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await signIn('google', { redirectTo: '/dashboard' });
    } catch (e: any) {
      setError(e?.message ?? 'Sign-in failed. Use a @codelude.com Google account.');
      setLoading(false);
    }
  }

  return (
    <div>
      {error && <div className="login-error">{error}</div>}
      <button className="btn-primary" type="button" onClick={handleGoogle} disabled={loading}
        style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '0.5rem' }}>
        {loading ? 'Redirecting to Google…' : 'Continue with Google →'}
      </button>
    </div>
  );
}
