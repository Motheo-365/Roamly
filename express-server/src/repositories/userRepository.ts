import pool from "../db/connection.js";

/**
 * Represents a user in the database.
 *
 * The password is stored as a hash rather than the
 * user's original password.
 */
export interface User {
    id: number;
    email: string;
    password_hash: string;
}

/**
 * Repository Pattern
 *
 * UserRepository is responsible for communicating
 * directly with PostgreSQL for user-related operations.
 *
 * It keeps SQL/database logic separate from the
 * Service and Controller layers.
 *
 * AuthController
 *       ↓
 * AuthService
 *       ↓
 * UserRepository
 *       ↓
 * PostgreSQL
 */
class UserRepository {

    /**
     * Finds a user by their email address.
     *
     * This is primarily used during login and registration
     * to determine whether an account already exists.
     *
     * Returns null if no matching user exists.
     */
    async findUserByEmail(
        email: string
    ): Promise<User | null> {

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                password_hash
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Finds a user by their ID.
     *
     * This can be used when we need to retrieve the
     * currently authenticated user's information.
     *
     * Returns null if the user does not exist.
     */
    async findUserById(
        userId: number
    ): Promise<User | null> {

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                password_hash
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Creates a new user.
     *
     * The password received by this repository should
     * already be hashed by the Service Layer.
     */
    async createUser(
        email: string,
        passwordHash: string
    ): Promise<User> {

        const result = await pool.query(
            `
            INSERT INTO users (
                email,
                password_hash
            )
            VALUES ($1, $2)
            RETURNING
                id,
                email,
                password_hash
            `,
            [email, passwordHash]
        );

        return result.rows[0];
    }
}

export default new UserRepository();