const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST /api/auth/register
const register = async (req, res) =>
{
    try
    {
        const { nom, prenom, email, password, role } = req.body;

        if (!nom || !prenom || !email || !password)
        {
            return res.status(400).json({ message: "nom, prenom, email, password sont requis" });
        }

        const existing = await User.findOne({ email });
        if (existing)
        {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        const finalRole = role === "admin" ? "admin" : "student";

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await User.create({
            nom,
            prenom,
            email,
            passwordHash,
            role: finalRole,
            // filiereId, semestre, niveau seront remplis au premier questionnaire
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
                filiereId: user.filiereId,
                semestre: user.semestre,
                niveau: user.niveau,
            },
        });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// PUT /api/auth/me  (protégé — met à jour le profil de l'étudiant connecté)
const updateMe = async (req, res) =>
{
    try
    {
        const userId = req.user?.id;

        if (!userId)
        {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const { filiereId, semestre, niveau } = req.body;

        if (!filiereId || !semestre)
        {
            return res.status(400).json({ message: "filiereId et semestre sont requis" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                filiereId,
                semestre,
                niveau: niveau || "",
            },
            { new: true, runValidators: true }
        ).select("-passwordHash"); // ne pas renvoyer le mot de passe

        if (!updatedUser)
        {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({
            message: "Profil mis à jour",
            user: {
                id: updatedUser._id,
                nom: updatedUser.nom,
                prenom: updatedUser.prenom,
                email: updatedUser.email,
                role: updatedUser.role,
                filiereId: updatedUser.filiereId,
                semestre: updatedUser.semestre,
                niveau: updatedUser.niveau,
            },
        });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { register, login, updateMe };