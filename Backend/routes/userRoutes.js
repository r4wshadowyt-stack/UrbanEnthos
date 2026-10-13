const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

console.log("🔥 NEW USER ROUTES FILE LOADED 🔥");


// ==============================
// JWT AUTHENTICATION MIDDLEWARE
// ==============================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token =
        authHeader && authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            message: "Access denied. No token provided."
        });

    }

    try {

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "🔥 TOKEN ERROR:",
            error.message
        );

        return res.status(403).json({
            message: "Invalid or expired token."
        });

    }

}


// ==============================
// TEST ROUTE
// ==============================

router.get("/test", (req, res) => {

    res.send("TEST ROUTE WORKING");

});


// ==============================
// REGISTER USER
// ==============================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            password
        } = req.body;


        // Check existing user
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );


        if (existingUser.rows.length > 0) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // Create user
        const result = await pool.query(
            `INSERT INTO users
            (name, email, phone, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, phone`,
            [
                name,
                email,
                phone,
                hashedPassword
            ]
        );


        const user = result.rows[0];


        res.status(201).json({

            message: "Registration successful",

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }

        });


    } catch (error) {

        console.error(
            "🔥 REGISTER ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

});


// ==============================
// LOGIN USER
// ==============================

router.post("/login", async (req, res) => {

    console.log("🔥 Login request received");
    console.log(req.body);


    try {

        const {
            email,
            password
        } = req.body;


        // Find user
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                password,
                profile_image,
                role
             FROM users
             WHERE email = $1`,
            [email]
        );


        const user = result.rows[0];


        console.log(
            "User found:",
            user
        );


        if (!user) {

            console.log(
                "❌ User not found"
            );

            return res.status(400).json({
                message: "Invalid email or password"
            });

        }


        // Check password
        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        console.log(
            "Password match:",
            isMatch
        );


        if (!isMatch) {

            console.log(
                "❌ Wrong password"
            );

            return res.status(400).json({
                message: "Invalid email or password"
            });

        }


        console.log(
            "✅ Login Success"
        );


        // Create JWT
        const token =
            jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            );


        res.json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                profilePic:
                    user.profile_image || null
            }

        });


    } catch (error) {

        console.error(
            "🔥 LOGIN ERROR:",
            error
        );

        res.status(500).json({
            message: error.message
        });

    }

});


// ==============================
// GET LOGGED-IN USER PROFILE
// ==============================

router.get(
    "/profile",
    authenticateToken,
    async (req, res) => {

        try {

            const result = await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    phone,
                    profile_image,
                    role,
                    created_at,
                    updated_at
                 FROM users
                 WHERE id = $1`,
                [req.user.id]
            );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            const user =
                result.rows[0];


            res.json({

                message: "Profile retrieved successfully",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profilePic:
                        user.profile_image || null,
                    role: user.role,
                    createdAt: user.created_at,
                    updatedAt: user.updated_at
                }

            });


        } catch (error) {

            console.error(
                "🔥 GET PROFILE ERROR:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// ==============================
// UPDATE LOGGED-IN USER PROFILE
// ==============================

router.put(
    "/profile",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                name,
                email,
                phone
            } = req.body;


            // Basic validation
            if (!name || !email || !phone) {

                return res.status(400).json({
                    message:
                        "Name, email and phone are required."
                });

            }


            // Check whether another user
            // already uses this email
            const existingUser =
                await pool.query(
                    `SELECT id
                     FROM users
                     WHERE email = $1
                     AND id != $2`,
                    [
                        email,
                        req.user.id
                    ]
                );


            if (existingUser.rows.length > 0) {

                return res.status(400).json({
                    message:
                        "Email is already being used by another account."
                });

            }


            // Update profile
            const result =
                await pool.query(
                    `UPDATE users
                     SET
                        name = $1,
                        email = $2,
                        phone = $3,
                        updated_at = CURRENT_TIMESTAMP
                     WHERE id = $4
                     RETURNING
                        id,
                        name,
                        email,
                        phone,
                        profile_image,
                        role,
                        updated_at`,
                    [
                        name,
                        email,
                        phone,
                        req.user.id
                    ]
                );


            if (result.rows.length === 0) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            const user =
                result.rows[0];


            res.json({

                message:
                    "Profile updated successfully",

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profilePic:
                        user.profile_image || null,
                    role: user.role,
                    updatedAt:
                        user.updated_at
                }

            });


        } catch (error) {

            console.error(
                "🔥 UPDATE PROFILE ERROR:",
                error
            );

            res.status(500).json({
                message: error.message
            });

        }

    }
);


// ==============================
// TEST ROUTE 2
// ==============================

router.get("/test2", (req, res) => {

    res.send("TEST 2 WORKING");

});


// ==============================
// EXPORT ROUTER
// ==============================

module.exports = router;