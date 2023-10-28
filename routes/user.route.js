const router = require("express").Router();
const {
    registerUser,
    loginUser,
    logoutUser,
    loggedIn,
} = require("../controllers/user.controller");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/loggedIn", loggedIn);

module.exports = router;
