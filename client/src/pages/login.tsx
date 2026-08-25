import { useState } from "react";
import AuthLayout from "../components/auth/authLayout";
import Button from "../components/ui/button";
import Input from "../components/ui/input";

// Styling
import '../styles/login.css'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <AuthLayout>
      <div className="login-container">
        <div className="login-header">
          <span className="eyebrow">WELCOME BACK</span>

          <h1>Ready to roam?</h1>

          <p>
            Sign in to continue planning your next adventure.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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

          <div className="form-options">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a href="#">Forgot password?</a>
          </div>

          <Button type="submit">
            Log in
          </Button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <p className="signup-text">
          Don't have an account?{" "}
          <a href="#">Create one</a>
        </p>
      </div>
    </AuthLayout>
  );
}