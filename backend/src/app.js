const express = require("express");
const cors = require("cors");

const moduleRoutes = require("./routes/moduleRoutes");
const filiereRoutes = require("./routes/filiereRoutes");
const ressourceRoutes = require("./routes/ressourceRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/modules", moduleRoutes);
app.use("/api/filieres", filiereRoutes);
app.use("/api/ressources", ressourceRoutes);
app.use("/api/submissions", submissionRoutes);

// middleware 404
app.use((req, res) =>
{
    res.status(404).json({ message: "Route introuvable" });
});

module.exports = app;