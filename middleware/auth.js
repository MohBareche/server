const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token)
            return res
                .status(401)
                .json({ message: "Non autorisé. Veuillez vous connecter !" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified.user;

        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            message: "Non autorisé. Veuillez vous connecter !",
        });
    }
}

module.exports = auth;
