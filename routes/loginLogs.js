const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Asegúrate de tener el archivo db.js configurado

// Obtener todos los logs de sesión
router.get("/", async (req, res) => {
  try {
    const [logs] = await pool.execute(`
      SELECT sl.id, u.username, sl.action, sl.date_time
      FROM session_logs sl
      JOIN users u ON sl.user_id = u.id
      ORDER BY sl.date_time DESC
    `);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
