import LoginForm from '@/components/LoginForm';
import Logo from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Logo size={26} />
          <span className="logo-text">Code<span>lude</span></span>
          <span className="hq-badge">HQ</span>
        </div>
        <div className="login-header">
          <h1>Sign in</h1>
          <p>Internal access only. Google account on the @codelude.com domain required.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
