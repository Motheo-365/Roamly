interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-overlay">
          <div className="brand">
            <span className="brand-mark">R</span>
            <span>Roamly</span>
          </div>

          <div className="auth-quote">
            <p>Your next adventure starts here.</p>
          </div>
        </div>
      </section>

      <section className="auth-content">
        {children}
      </section>
    </main>
  );
}