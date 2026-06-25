const express = require("express");
const router = express.Router();
const { login, me } = require("../controller/authController");
const { autenticar } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", autenticar, me);

module.exports = router;
