const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) =>
{
    try
    {
        const authHeader = req.headers.authorization;

        // Vérifier présence du header
        if (!authHeader || !authHeader.startsWith("Bearer "))
        {
            return res.status(401).json({ message: "Accès non autorisé (token manquant)" });
        }

        // Extraire le token
        const token = authHeader.split(" ")[1];

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Injecter les infos utilisateur dans la requête
        req.user = {
            id: decoded.id,
            role: decoded.role || "student",
        };

        next();
    } catch (error)
    {
        return res.status(401).json({
            message: "Token invalide ou expiré",
            error: error.message,
        });
    }
};

module.exports = authMiddleware;