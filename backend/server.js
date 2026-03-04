const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) =>
{
    res.json({ ok: true, message: "Backend is running" });
});

connectDB().catch((err) =>
{
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));