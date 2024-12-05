const express = require("express");
const router = express.Router();
const { Sale, SaleProduct } = require("../models");

// Generar reporte de ventas
router.get("/", async (req, res) => {
  const { start_date, end_date } = req.query;
  try {
    const sales = await Sale.findAll({
      where: {
        date_time: { $between: [start_date, end_date] },
      },
      include: SaleProduct,
    });

    const totalSales = sales.length;
    const totalIncome = sales.reduce((sum, sale) => sum + sale.total_amount, 0);

    res.json({ totalSales, totalIncome });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
