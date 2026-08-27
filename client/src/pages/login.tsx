import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { loginUser } from "../services/apiService";

import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      const token = response.data.token;

      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      localStorage.setItem("roamly_token", token);
      localStorage.setItem(
        "roamly_user",
        JSON.stringify({
          id: response.data.id,
          email: response.data.email,
        }),
      );

      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <span className="eyebrow">WELCOME BACK</span>

        <h1>Welcome back.</h1>

        <p>
          Pick up where you left off and continue planning your next adventure.
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

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
        />

        {error && <p className="form-error">{error}</p>}

        <div className="form-options">
          <label className="remember">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <Link to="#">Forgot password?</Link>
        </div>

        <Button type="submit">{loading ? "Logging in..." : "Log in"}</Button>
      </form>

      <div className="divider">
        <span>or</span>
      </div>

      <p className="signup-text">
        Don't have an account? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}

export default Login;
