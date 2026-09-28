const jwt = require("jsonwebtoken");

// ============================================================
// Authentication Middleware
// ============================================================
// Checks whether a valid JWT token was sent by the client.
// Protected API routes will use this middleware.
// ============================================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    // No Authorization header
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });
    }

    // Expected format:
    // Authorization: Bearer TOKEN
    const parts = authHeader.split(" ");

    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {
        return res.status(401).json({
            success: false,
            message: "Invalid authentication token."
        });
    }

    const token = parts[1];

    try {

        // Verify token using our private JWT secret
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store authenticated user information
        // so protected routes know which student is logged in.
        req.user = {
            userId: decoded.userId,
            username: decoded.username
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token."
        });
    }
}

module.exports = authenticateToken;