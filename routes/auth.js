/*
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userQuery = `SELECT * FROM users WHERE username = ?`;
  pool.query(userQuery, [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(401).send("Usuario no encontrado");

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).send("Credenciales incorrectas");

    const token = jwt.sign({ id: user.id, role: user.role }, "secret", {
      expiresIn: "1h",
    });
    res.json({ token });
  });
});

module.exports = router;
*/

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rutas de autenticación
router.post("/login", authController.login);
router.post("/register", authController.register);

module.exports = router;
