const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

console.log("🔥 NEW USER ROUTES FILE LOADED 🔥");

router.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});


// REGISTER USER
router.post("/register", async (req, res) => {

    try {

        const { name, email, phone, password } = req.body;


        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({

            name,
            email,
            phone,
            password: hashedPassword

        });


        res.status(201).json({

            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



// LOGIN USER
router.post("/login", async (req, res) => {

    console.log("🔥 Login request received");
    console.log(req.body);

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isMatch);

        if (!isMatch) {
            console.log("❌ Wrong password");
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        console.log("✅ Login Success");

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
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
router.get("/test2", (req, res) => {
    res.send("TEST 2 WORKING");
});


module.exports = router;