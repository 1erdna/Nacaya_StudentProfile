const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../db");

const router = express.Router();

// ============================================================
// POST /api/auth/login
// Authenticate a student using username/email and password
// ============================================================
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        // Find user by username OR email
        const [users] = await pool.execute(
            `SELECT
                user_id,
                username,
                email,
                password_hash
             FROM users
             WHERE username = ? OR email = ?
             LIMIT 1`,
            [username, username]
        );

        // User does not exist
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        const user = users[0];

        // Compare entered password with bcrypt hash
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        }

        // Create authentication token
        const token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );

        // Successful login
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token: token,
            user: {
                userId: user.user_id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while logging in."
        });
    }
});

module.exports = router;