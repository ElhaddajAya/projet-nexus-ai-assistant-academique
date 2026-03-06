const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/register
const register = async (req, res) =>
{
    try
    {
        const { nom, prenom, email, password, role, filiereId, semestre, niveau } = req.body;

        if (!nom || !prenom || !email || !password)
        {
            return res.status(400).json({ message: "nom, prenom, email, password sont requis" });
        }

        const existing = await User.findOne({ email });
        if (existing)
        {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // role par défaut
        const finalRole = role === "admin" ? "admin" : "student";

        // si student, filiere/semestre sont utiles (optionnels selon votre CDC)
        if (finalRole === "student" && (!filiereId || !semestre))
        {
            return res.status(400).json({ message: "filiereId et semestre sont requis pour un étudiant" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            nom,
            prenom,
            email,
            passwordHash,
            role: finalRole,
            filiereId: finalRole === "student" ? filiereId : undefined,
            semestre: finalRole === "student" ? semestre : undefined,
            niveau: finalRole === "student" ? (niveau || "") : "",
        });

        res.status(201).json({
            message: "Utilisateur créé",
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// POST /api/auth/login
const login = async (req, res) =>
{
    try
    {
        const { email, password } = req.body;

        if (!email || !password)
        {
            return res.status(400).json({ message: "Email et mot de passe requis" });
        }

        const user = await User.findOne({ email });
        if (!user)
        {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
        {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { register, login };