const express = require("express");
const router = express.Router();
const { Log } = require("../models/log");

// Obtener logs
router.get("/", async (req, res) => {
  const { type, product_id, start_date, end_date } = req.query;
  try {
    const logs = await Log.findAll({
      where: {
        ...(type && { type }),
        ...(product_id && { product_id }),
        ...(start_date &&
          end_date && { created_at: { $between: [start_date, end_date] } }),
      },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
