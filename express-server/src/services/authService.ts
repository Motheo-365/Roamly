import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Resend } from "resend";

import userRepository, { User } from "../repositories/userRepository.js";

/**
 * Service Layer
 *
 * AuthService contains the business logic related
 * to user registration and authentication.
 *
 * The Service Layer sits between the Controller
 * and Repository.
 *
 * AuthController
 *       ↓
 * AuthService
 *       ↓
 * UserRepository
 *       ↓
 * PostgreSQL
 */
class AuthService {
  /**
   * Registers a new user.
   *
   * Business rules:
   * - Email cannot be empty.
   * - Password cannot be empty.
   * - Email must not already exist.
   * - Password must be hashed before being stored.
   */
  async register(email: string, password: string): Promise<User> {
    // Remove unnecessary whitespace from the email.
    email = email.trim().toLowerCase();

    // Email is required.
    if (!email) {
      throw new Error("Email is required");
    }

    // Password is required.
    if (!password) {
      throw new Error("Password is required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error("Password must contain at least one special character");
    }

    // Check whether an account already exists.
    const existingUser = await userRepository.findUserByEmail(email);

    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    // Hash the password before storing it.
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the user using the hashed password.
    return userRepository.createUser(email, passwordHash);
  }

  /**
   * Authenticates an existing user.
   *
   * The password supplied during login is compared
   * against the hashed password stored in PostgreSQL.
   */
  async login(
    email: string,
    password: string,
  ): Promise<{
    user: User;
    token: string;
  }> {
    email = email.trim().toLowerCase();

    if (!email) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      throw new Error("Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    /**
     * Create a JWT containing the user's ID.
     *
     * We don't put the password or password hash
     * inside the token.
     */
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      {
        expiresIn: "1d",
      },
    );

    return {
      user,
      token,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    email = email.trim().toLowerCase();

    if (!email) {
      throw new Error("Email is required");
    }

    const user = await userRepository.findUserByEmail(email);

    /*
     * We deliberately don't reveal whether the
     * email exists or not.
     *
     * This prevents account enumeration.
     */
    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await userRepository.setPasswordResetToken(user.id, tokenHash, expires);

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured");
    }

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(resendApiKey);

    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  const { data, error } = await resend.emails.send({
      from: "Roamly <onboarding@resend.dev>",
      to: email,
      subject: "Reset your Roamly password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h1>Reset your password</h1>

          <p>
            We received a request to reset your Roamly password.
          </p>

          <p>
            Click the button below to choose a new password.
          </p>

          <p>
            <a
              href="${resetUrl}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background: #d46b3c;
                color: white;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Reset password
            </a>
          </p>

          <p>This link will expire in 1 hour.</p>

          <p>
            If you didn't request a password reset,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);
      throw new Error("Unable to send password reset email.");
    }

    console.log("RESEND SUCCESS:", data);;
  }

  async resetPassword(token: string, password: string): Promise<void> {
    if (!token) {
      throw new Error("Reset token is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!/[a-z]/.test(password)) {
      throw new Error("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      throw new Error("Password must contain at least one special character");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userRepository.findUserByResetToken(tokenHash);

    if (!user) {
      throw new Error("This password reset link is invalid or has expired.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await userRepository.updatePassword(user.id, passwordHash);
  }
}

export default new AuthService();
