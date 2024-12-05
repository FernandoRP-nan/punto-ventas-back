const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Asegúrate de tener el archivo db.js configurado

// Registrar una venta
router.post("/", async (req, res) => {
  const { cashier_id, products } = req.body;

  try {
    // Calcular el total de la venta
    const totalAmount = products.reduce((sum, product) => {
      return sum + product.quantity * product.unit_price;
    }, 0);

    // Insertar la venta en la tabla 'sales'
    const [saleResult] = await pool.execute(
      "INSERT INTO sales (cashier_id, total_amount) VALUES (?, ?)",
      [cashier_id, totalAmount]
    );

    const saleId = saleResult.insertId;

    // Insertar los detalles de la venta en 'sale_details' y actualizar el stock
    for (const product of products) {
      await pool.execute(
        "INSERT INTO sale_details (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [saleId, product.product_id, product.quantity, product.unit_price]
      );

      await pool.execute("UPDATE products SET stock = stock - ? WHERE id = ?", [
        product.quantity,
        product.product_id,
      ]);
    }

    res.status(201).json({
      sale_id: saleId,
      total_amount: totalAmount,
      products,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [sales] = await pool.execute("SELECT * FROM sales");
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
