require("dotenv").config();

require("./config/db");

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

console.log("🔥 Users router mounted");

app.get("/", (req, res) => {
    res.send("🚀 Urban Enthos Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});