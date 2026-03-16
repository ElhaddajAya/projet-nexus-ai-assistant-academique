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
            // filiereId et niveau seront remplis au premier questionnaire
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
                filiereId: user.filiereId,   // peut être null si premier login
                niveau: user.niveau,          // peut être vide si premier login
            },
        });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// PUT /api/auth/me  (protégé — met à jour filière + niveau de l'étudiant)
// Le semestre n'est PAS stocké dans User car il change à chaque questionnaire
const updateMe = async (req, res) =>
{
    try
    {
        const userId = req.user?.id;

        if (!userId)
        {
            return res.status(401).json({ message: "Non autorisé" });
        }

        const { filiereId, niveau } = req.body;

        // Seul filiereId est obligatoire
        if (!filiereId)
        {
            return res.status(400).json({ message: "filiereId est requis" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                filiereId,
                niveau: niveau || "",
            },
            { new: true, runValidators: true }
        ).select("-passwordHash");

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
                niveau: updatedUser.niveau,
            },
        });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// PUT /api/auth/change-password
const changePassword = async (req, res) =>
{
    try
    {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // Vérifier l'ancien mot de passe
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch)
        {
            return res.status(400).json({ message: "Mot de passe actuel incorrect" });
        }

        // Hasher et sauvegarder le nouveau
        user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Mot de passe modifié avec succès" });
    } catch (error)
    {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { register, login, updateMe, changePassword };