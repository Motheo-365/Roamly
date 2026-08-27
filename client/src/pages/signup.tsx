import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "../components/ui/button";
import Input from "../components/ui/input";

import { registerUser } from "../services/apiService";

import "../styles/login.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordRequirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passwordIsValid =
    passwordRequirements.length &&
    passwordRequirements.lowercase &&
    passwordRequirements.uppercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    if (!passwordIsValid) {
      setError("Please meet all password requirements.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(email, password);

      navigate("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <span className="eyebrow">GET STARTED</span>

        <h1>Create your account.</h1>

        <p>Start planning trips that you'll actually remember.</p>
        {error && <p className="form-error">{error}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
        />

        <div className="password-requirements">
          <p>Password must contain:</p>

          <div
            className={
              passwordRequirements.length ? "requirement valid" : "requirement"
            }
          >
            <span>{passwordRequirements.length ? "✓" : "○"}</span>
            At least 8 characters
          </div>

          <div
            className={
              passwordRequirements.lowercase
                ? "requirement valid"
                : "requirement"
            }
          >
            <span>{passwordRequirements.lowercase ? "✓" : "○"}</span>
            One lowercase letter
          </div>

          <div
            className={
              passwordRequirements.uppercase
                ? "requirement valid"
                : "requirement"
            }
          >
            <span>{passwordRequirements.uppercase ? "✓" : "○"}</span>
            One uppercase letter
          </div>

          <div
            className={
              passwordRequirements.number ? "requirement valid" : "requirement"
            }
          >
            <span>{passwordRequirements.number ? "✓" : "○"}</span>
            One number
          </div>

          <div
            className={
              passwordRequirements.special ? "requirement valid" : "requirement"
            }
          >
            <span>{passwordRequirements.special ? "✓" : "○"}</span>
            One special character
          </div>
        </div>
        <div className="form-options">
          <label className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <Link to="#">Forgot password?</Link>
        </div>

        <Button type="submit">
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <p className="signup-text">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
