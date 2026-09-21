import LoginForm from '@/components/LoginForm';
import Logo from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <Logo size={38} />
          <span className="logo-text">CODE<span>LUDE</span></span>
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
