import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository, {
    User
} from "../repositories/userRepository.js";

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
    async register(
        email: string,
        password: string
    ): Promise<User> {

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

        // Check whether an account already exists.
        const existingUser =
            await userRepository.findUserByEmail(email);

        if (existingUser) {
            throw new Error(
                "A user with this email already exists"
            );
        }

        // Hash the password before storing it.
        const passwordHash =
            await bcrypt.hash(password, 12);

        // Create the user using the hashed password.
        return userRepository.createUser(
            email,
            passwordHash
        );
    }

    /**
     * Authenticates an existing user.
     *
     * The password supplied during login is compared
     * against the hashed password stored in PostgreSQL.
     */
    async login(
        email: string,
        password: string
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

        const user =
            await userRepository.findUserByEmail(email);

        if (!user) {
            throw new Error(
                "Invalid email or password"
            );
        }

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.password_hash
            );

        if (!passwordMatches) {
            throw new Error(
                "Invalid email or password"
            );
        }

        const secret =
            process.env.JWT_SECRET;

        if (!secret) {
            throw new Error(
                "JWT_SECRET is not configured"
            );
        }

        /**
         * Create a JWT containing the user's ID.
         *
         * We don't put the password or password hash
         * inside the token.
         */
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            {
                expiresIn: "1d"
            }
        );

        return {
            user, token
        };
    }
}

export default new AuthService();