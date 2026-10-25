
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const customRequestRoutes = require("./routes/customRequestRoutes");
const cartImageRoutes = require("./routes/cartImageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();

const frontendOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : null;

app.use(
    cors(
        frontendOrigins
            ? { origin: frontendOrigins }
            : {}
    )
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    res.status(200).send("UrbanEthos Backend Running!");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "UrbanEthos API"
    });
});

// Existing login, registration, and profile routes
app.use("/api/users", userRoutes);

// New custom design request route
app.use("/api/custom-requests", customRequestRoutes);
app.use("/api/cart-images", cartImageRoutes);
app.use("/api/orders", orderRoutes);
// Central error handler
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        return res.status(400).json({
            message: "Invalid JSON request body."
        });
    }

    console.error("SERVER ERROR:", err.message);

    return res.status(500).json({
        message: "An internal server error occurred."
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`UrbanEthos API listening on port ${PORT}`);
});

async function shutdown() {
    server.close(async () => {
        try {
            await pool.end();
            console.log("PostgreSQL connection pool closed.");
            process.exit(0);
        } catch (error) {
            console.error(
                "Error closing PostgreSQL pool:",
                error.message
            );
            process.exit(1);
        }
    });
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
