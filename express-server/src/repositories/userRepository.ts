import pool from "../db/connection.js";

/**
 * Represents a user in the database.
 */
export interface User {
    id: number;
    email: string;
    password_hash: string;
    reset_password_token: string | null;
    reset_password_expires: Date | null;
}

/**
 * Repository Pattern
 *
 * UserRepository is responsible for communicating
 * directly with PostgreSQL for user-related operations.
 */
class UserRepository {

    /**
     * Finds a user by email.
     */
    async findUserByEmail(
        email: string
    ): Promise<User | null> {

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                password_hash,
                reset_password_token,
                reset_password_expires
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Finds a user by ID.
     */
    async findUserById(
        userId: number
    ): Promise<User | null> {

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                password_hash,
                reset_password_token,
                reset_password_expires
            FROM users
            WHERE id = $1
            `,
            [userId]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Creates a new user.
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
                password_hash,
                reset_password_token,
                reset_password_expires
            `,
            [email, passwordHash]
        );

        return result.rows[0];
    }

    /**
     * Stores a hashed password-reset token
     * and its expiry time.
     */
    async setPasswordResetToken(
        userId: number,
        tokenHash: string,
        expires: Date
    ): Promise<void> {

        await pool.query(
            `
            UPDATE users
            SET
                reset_password_token = $1,
                reset_password_expires = $2
            WHERE id = $3
            `,
            [tokenHash, expires, userId]
        );
    }

    /**
     * Finds a user using a valid password-reset token.
     *
     * The token passed here should already be hashed.
     */
    async findUserByResetToken(
        tokenHash: string
    ): Promise<User | null> {

        const result = await pool.query(
            `
            SELECT
                id,
                email,
                password_hash,
                reset_password_token,
                reset_password_expires
            FROM users
            WHERE reset_password_token = $1
              AND reset_password_expires > NOW()
            `,
            [tokenHash]
        );

        return result.rows[0] ?? null;
    }

    /**
     * Updates the user's password and clears
     * the password-reset token.
     */
    async updatePassword(
        userId: number,
        passwordHash: string
    ): Promise<void> {

        await pool.query(
            `
            UPDATE users
            SET
                password_hash = $1,
                reset_password_token = NULL,
                reset_password_expires = NULL
            WHERE id = $2
            `,
            [passwordHash, userId]
        );
    }
}

export default new UserRepository();