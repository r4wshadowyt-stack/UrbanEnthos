
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

// ========================================
// CONFIGURATION & HELPERS
// ========================================

function normalizeEmail(email) {
    return email.trim().toLowerCase();
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured.");

        return res.status(500).json({
            message: "Authentication service is unavailable."
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            return res.status(403).json({
                message: "Invalid authentication token."
            });
        }

        req.user = decoded;
        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token."
        });
    }
}

function formatUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePic: user.profile_image || "default.png",
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
    };
}

// ========================================
// TEST ROUTES
// ========================================

router.get("/test", (req, res) => {
    res.json({
        message: "UrbanEthos API is working."
    });
});

router.get("/test2", (req, res) => {
    res.send("TEST 2 WORKING");
});

// ========================================
// REGISTER USER
// ========================================

router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email and password are required."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = normalizeEmail(email);

        if (cleanName.length > 150) {
            return res.status(400).json({
                message: "Name must not exceed 150 characters."
            });
        }

        if (
            cleanEmail.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                message: "Password must be between 8 and 72 characters."
            });
        }

        let cleanPhone = null;

        if (phone !== undefined && phone !== null && phone !== "") {
            if (typeof phone !== "string" && typeof phone !== "number") {
                return res.status(400).json({
                    message: "Please enter a valid phone number."
                });
            }

            cleanPhone = String(phone).trim();

            if (cleanPhone.length > 30) {
                return res.status(400).json({
                    message: "Phone number must not exceed 30 characters."
                });
            }
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE LOWER(email) = $1",
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
    (name, email, phone, password)
VALUES($1, $2, $3, $4)
             RETURNING id, name, email, phone,
    profile_image, role, created_at, updated_at`,
            [cleanName, cleanEmail, cleanPhone, hashedPassword]
        );

        return res.status(201).json({
            message: "Registration successful.",
            user: formatUser(result.rows[0])
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        console.error("REGISTER ERROR:", error.message);

        return res.status(500).json({
            message: "Unable to register right now."
        });
    }
});

// ========================================
// LOGIN USER
// ========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");

            return res.status(500).json({
                message: "Authentication service is unavailable."
            });
        }

        const cleanEmail = normalizeEmail(email);

        const result = await pool.query(
            `SELECT id, name, email, phone, password,
    profile_image, role, created_at, updated_at
             FROM users
             WHERE LOWER(email) = $1`,
            [cleanEmail]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.json({
            message: "Login successful.",
            token,
            user: formatUser(user)
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error.message);

        return res.status(500).json({
            message: "Unable to log in right now."
        });
    }
});

// ========================================
// GET LOGGED-IN USER PROFILE
// ========================================

router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, phone, profile_image,
    role, created_at, updated_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.json({
            message: "Profile retrieved successfully.",
            user: formatUser(result.rows[0])
        });

    } catch (error) {
        console.error("GET PROFILE ERROR:", error.message);

        return res.status(500).json({
            message: "Unable to retrieve profile right now."
        });
    }
});

// ========================================
// UPDATE USER PROFILE
// ========================================

router.put("/profile", authenticateToken, async (req, res) => {
    try {
        const { name, email, phone } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            !name.trim() ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: "Name and email are required."
            });
        }

        const cleanName = name.trim();
        const cleanEmail = normalizeEmail(email);

        if (cleanName.length > 150) {
            return res.status(400).json({
                message: "Name must not exceed 150 characters."
            });
        }

        if (
            cleanEmail.length > 255 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
        ) {
            return res.status(400).json({
                message: "Please enter a valid email address."
            });
        }

        let cleanPhone = null;

        if (phone !== undefined && phone !== null && phone !== "") {
            if (typeof phone !== "string" && typeof phone !== "number") {
                return res.status(400).json({
                    message: "Please enter a valid phone number."
                });
            }

            cleanPhone = String(phone).trim();

            if (cleanPhone.length > 30) {
                return res.status(400).json({
                    message: "Phone number must not exceed 30 characters."
                });
            }
        }

        const result = await pool.query(
            `UPDATE users
             SET name = $1,
    email = $2,
    phone = $3,
    updated_at = CURRENT_TIMESTAMP
             WHERE id = $4
             AND NOT EXISTS(
        SELECT 1 FROM users
                 WHERE LOWER(email) = $2
                 AND id <> $4
    )
             RETURNING id, name, email, phone,
    profile_image, role, created_at, updated_at`,
            [cleanName, cleanEmail, cleanPhone, req.user.id]
        );

        if (result.rows.length === 0) {
            const account = await pool.query(
                "SELECT id FROM users WHERE id = $1",
                [req.user.id]
            );

            if (account.rows.length === 0) {
                return res.status(404).json({
                    message: "User not found."
                });
            }

            return res.status(409).json({
                message: "Email is already being used by another account."
            });
        }

        return res.json({
            message: "Profile updated successfully.",
            user: formatUser(result.rows[0])
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "Email is already being used by another account."
            });
        }

        console.error("UPDATE PROFILE ERROR:", error.message);

        return res.status(500).json({
            message: "Unable to update profile right now."
        });
    }
});

// ========================================
// CHANGE PASSWORD
// ========================================

router.put(
    "/change-password",
    authenticateToken,
    async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body || {};

            if (
                typeof currentPassword !== "string" ||
                typeof newPassword !== "string" ||
                !currentPassword ||
                !newPassword
            ) {
                return res.status(400).json({
                    message: "Current password and new password are required."
                });
            }

            if (newPassword.length < 8 || newPassword.length > 72) {
                return res.status(400).json({
                    message: "New password must be between 8 and 72 characters."
                });
            }

            if (currentPassword === newPassword) {
                return res.status(400).json({
                    message: "Your new password must be different."
                });
            }

            const result = await pool.query(
                "SELECT password FROM users WHERE id = $1",
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    message: "User account not found."
                });
            }

            const matches = await bcrypt.compare(
                currentPassword,
                result.rows[0].password
            );

            if (!matches) {
                return res.status(400).json({
                    message: "Your current password is incorrect."
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await pool.query(
                `UPDATE users
                 SET password = $1,
    updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [hashedPassword, req.user.id]
            );

            return res.json({
                message: "Password changed successfully."
            });

        } catch (error) {
            console.error("CHANGE PASSWORD ERROR:", error.message);

            return res.status(500).json({
                message: "Unable to change password right now."
            });
        }
    }
);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;
