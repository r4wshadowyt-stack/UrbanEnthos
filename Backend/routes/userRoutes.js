const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../config/db");

console.log("🔥 NEW USER ROUTES FILE LOADED 🔥");


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

        const { name, email, phone, password } = req.body;

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
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const result = await pool.query(
            `INSERT INTO users
            (name, email, phone, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email`,
            [name, email, phone, hashedPassword]
        );


        const user = result.rows[0];


        res.status(201).json({

            message: "Registration successful",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        console.error("🔥 REGISTER ERROR:", error);

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

        const { email, password } = req.body;


        // Find user
        const result = await pool.query(
            `SELECT id, name, email, password, role
             FROM users
             WHERE email = $1`,
            [email]
        );


        const user = result.rows[0];

        console.log("User found:", user);


        if (!user) {

            console.log("❌ User not found");

            return res.status(400).json({
                message: "Invalid email or password"
            });

        }


        // Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log("Password match:", isMatch);


        if (!isMatch) {

            console.log("❌ Wrong password");

            return res.status(400).json({
                message: "Invalid email or password"
            });

        }


        console.log("✅ Login Success");


        // Create JWT
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


        res.json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        console.error("🔥 LOGIN ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }

});


// ==============================
// TEST ROUTE 2
// ==============================

router.get("/test2", (req, res) => {
    res.send("TEST 2 WORKING");
});


module.exports = router;