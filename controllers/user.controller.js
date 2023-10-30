const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { username, email, password, passwordVerify } = req.body;
        // validation
        if (!username || !email || !password || !passwordVerify)
            return res.status(400).json({
                message: "Tous les champs sont obligatoires !",
                success: false,
            });

        if (password.length < 6)
            return res.status(400).json({
                message: "Entrez un mot de passe > 6 caracteres",
                success: false,
            });

        if (password !== passwordVerify)
            return res.status(400).json({
                message: "Les mots de passe ne sont pas identiques",
                success: false,
            });

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                message: "Le courriel existe déja. Veuillez taper un autre !",
                success: false,
            });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();
        // sign the token
        const token = jwt.sign(
            {
                user: savedUser._id,
            },
            process.env.JWT_SECRET
        );
        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .status(201)
            .json({
                message: "Utilisateur enregistré avec succes !",
                success: true,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Probleme d'entregistrement",
            success: false,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password)
            return res.status(400).json({
                message: "Tous les champs sont obligatoires !",
            });

        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(400).json({
                message:
                    "Oups ! Quelque chose s'est mal tourné. Veuillez réessayer une autre fois !",
            });

        // vérification password
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!passwordCorrect)
            return res
                .status(401)
                .json({ message: "Courriel et/ou mot de passe non valide !" });

        // sign the token
        const token = jwt.sign(
            {
                user: existingUser._id,
            },
            process.env.JWT_SECRET
        );
        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
            .status(201)
            .json({ message: "Utilisateur connecté avec succes !" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Probleme d'entregistrement" });
    }
};

const logoutUser = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none",
    });
    res.send();
};

const loggedIn = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json(false);

        jwt.verify(token, process.env.JWT_SECRET);
        res.json(true);
    } catch (error) {
        res.json(false);
    }
};

module.exports = { registerUser, loginUser, logoutUser, loggedIn };
