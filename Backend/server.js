
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const pool = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

// Configure FRONTEND_URL in production.
// Multiple origins can be comma-separated.
const frontendOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL
        .split(",")
        .map(origin => origin.trim())
        .filter(Boolean)
    : null;

app.use(cors(
    frontendOrigins
        ? { origin: frontendOrigins }
        : {}
));

app.use(express.json({ limit: "1mb" }));

// ========================================
// ROUTES
// ========================================

app.get("/", (req, res) => {
    res.status(200).send("UrbanEthos Backend Running!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "UrbanEthos API"
    });
});

app.use("/api/users", userRoutes);

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            message: "Invalid JSON request body."
        });
    }

    console.error("SERVER ERROR:", err.message);

    return res.status(500).json({
        message: "An internal server error occurred."
    });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`UrbanEthos API listening on port ${PORT}`);
});

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

async function shutdown() {
    console.log("Shutting down UrbanEthos API...");

    server.close(async () => {
        try {
            await pool.end();
            process.exit(0);
        } catch (error) {
            console.error("Database shutdown error:", error.message);
            process.exit(1);
        }
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
