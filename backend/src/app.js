const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const matiereRoutes = require("./routes/matiereRoutes");
const filiereRoutes = require("./routes/filiereRoutes");
const ressourceRoutes = require("./routes/ressourceRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes"); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/matieres", matiereRoutes);
app.use("/api/filieres", filiereRoutes);
app.use("/api/ressources", ressourceRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/recommendations", recommendationRoutes);

// middleware 404
app.use((req, res) =>
{
    res.status(404).json({ message: "Route introuvable" });
});

module.exports = app;