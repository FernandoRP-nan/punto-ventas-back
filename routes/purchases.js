const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Importa el pool de conexión

// Registrar una compra
router.post("/", async (req, res) => {
  const { manager_id, product_id, quantity } = req.body;
  try {
    // Verificar que el producto exista
    const [product] = await pool.query("SELECT * FROM products WHERE id = ?", [
      product_id,
    ]);
    if (product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificar que no se exceda el stock máximo
    if (product[0].stock + quantity > product[0].max_stock) {
      return res.status(400).json({ message: "Stock máximo excedido" });
    }

    // Registrar la compra en la base de datos
    const [purchaseResult] = await pool.query(
      "INSERT INTO purchases (manager_id, product_id, quantity) VALUES (?, ?, ?)",
      [manager_id, product_id, quantity]
    );

    // Actualizar el stock del producto
    await pool.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
      quantity,
      product_id,
    ]);

    res
      .status(201)
      .json({ id: purchaseResult.insertId, manager_id, product_id, quantity });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
