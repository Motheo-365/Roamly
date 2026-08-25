import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/button";
import Input from "../components/ui/input";

// Styling
import '../styles/login.css'
import { useState } from "react";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        console.log({
            email,
            password,
        });

        navigate("/login");
    };

    return (
        <div className="login-container">
            <div className="login-header">
                <span className="eyebrow">
                    GET STARTED
                </span>

                <h1>Create your account.</h1>

                <p>
                    Start planning trips that you'll
                    actually remember.
                </p>

            </div>

            {/* Signup form will go here */}
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
                    Sign Up
                </Button>
            </form>

            <div className="divider">
                <span>or</span>
            </div>

            <p className="signup-text">
                Already have an account?{" "}
                <Link to="/login">
                    Log in
                </Link>
            </p>
        </div>
    );
}

export default Signup;