'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError('Invalid email or password.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      {error && <div className="login-error">{error}</div>}
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@codelude.com"
          required
          autoFocus
        />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <button className="btn-primary" type="submit" disabled={loading}
        style={{ width: '100%', justifyContent: 'center', display: 'flex', marginTop: '0.5rem' }}>
        {loading ? 'Signing in...' : 'Sign in →'}
      </button>
    </form>
  );
}
