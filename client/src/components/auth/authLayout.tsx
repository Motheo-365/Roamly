import React from "react";
import "../../styles/login.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-overlay">
          {/* Replaces div.brand with a full Navigation Bar */}
          <nav className="auth-nav">
            <div className="brand">
              <span>Roamly</span>
            </div>

            <ul className="nav-links">
              <li><a href="/">Home</a></li>
              <li><a href="/explore">Explore</a></li>
              <li><a href="/destinations">Destinations</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>

          <div className="auth-quote">
            <p>"Travel makes one modest. You see what a tiny place you occupy in the world."</p>
            <span>— Gustave Flaubert</span>
          </div>

          <div className="auth-overlay-spacer" />
        </div>
      </div>

      <div className="auth-content">
        {children}
      </div>
    </div>
  );
}