const express = require("express");
const router = express.Router();
const { Purchase, Product } = require("../models");

// Registrar una compra
router.post("/", async (req, res) => {
  const { manager_id, product_id, quantity } = req.body;
  try {
    const purchase = await Purchase.create({
      manager_id,
      product_id,
      quantity,
    });

    // Incrementar stock
    const product = await Product.findByPk(product_id);
    if (product) {
      product.stock += quantity;
      await product.save();
    }

    res.status(201).json(purchase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener historial de compras
router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.findAll({ include: Product });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
