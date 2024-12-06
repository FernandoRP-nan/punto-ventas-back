const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../config/authenticateToken");

// Rutas de autenticación
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout);
router.post("/register", authController.register);

module.exports = router;