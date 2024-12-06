const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../config/authenticateToken"); // Asegúrate de ajustar la ruta

// Rutas de autenticación
router.post("/login", authController.login);
router.post("/logout", authenticateToken, authController.logout); // Asegúrate de usar el middleware aquí
router.post("/register", authController.register); // Si no necesitas autenticación para el registro

module.exports = router;