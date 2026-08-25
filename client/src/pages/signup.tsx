import { useState } from "react";
import AuthLayout from "../components/auth/authLayout";
import Button from "../components/ui/button";
import Input from "../components/ui/input";

// Styling
import '../styles/login.css'

interface SignupProps {
  onSwitchToLogin?: () => void;
}

export default function Signup({ onSwitchToLogin }: SignupProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({
      fullName,
      email,
      password,
    });
  };

  return (
    <AuthLayout>
      <div className="login-container">
        <div className="login-header">
          <span className="eyebrow">START YOUR JOURNEY</span>

          <h1>One site for all your travel planning needs.</h1>

          <p>
            Create an account to unlock personalized trip planning and guides.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            value={fullName}
            onChange={setFullName}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
          />

          <div className="password-wrapper">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={setPassword}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <Button type="submit">
            Create Account
          </Button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="signup-text">
          Already have an account?{" "}
          <button 
            type="button" 
            className="link-button" 
            onClick={onSwitchToLogin}
          >
            <a href="login">Log in</a>
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}