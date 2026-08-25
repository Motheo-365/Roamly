import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/ui/button";
import Input from "../components/ui/input";

// Styling
import '../styles/login.css'


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        console.log({
            email,
            password,
        });
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <span className="eyebrow">
                    WELCOME BACK
                </span>

                <h1>Welcome back.</h1>

                <p>
                    Pick up where you left off and
                    continue planning your next adventure.
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

                <div className="form-options">
                    <label className="remember">
                        <input type="checkbox" />
                        <span>Remember me</span>
                    </label>

                    <Link to="#">
                        Forgot password?
                    </Link>
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
                <Link to="/signup">
                    Create one
                </Link>
            </p>
        </div>
    );
}

export default Login;