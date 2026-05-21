import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-text">Code<span>lude</span></span>
          <span className="hq-badge">HQ</span>
        </div>
        <div className="login-header">
          <h1>Sign in</h1>
          <p>Internal access only. Team credentials required.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
