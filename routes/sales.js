const express = require("express");
const router = express.Router();
const pool = require("../config/db");

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

      // Registrar el movimiento de inventario
      await pool.query(
        "INSERT INTO inventory_movement_logs (product_id, action, quantity) VALUES (?, ?, ?)",
        [product.product_id, "SALIDA", product.quantity] // Registro de salida
      );
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

// API to get sales report by shift
router.get("/cuts", async (req, res) => {
  const { date } = req.query;

  // Validar que se haya proporcionado una fecha
  if (!date) {
    return res.status(400).json({ error: "Date is required" });
  }

  // Crear objetos de fecha usando el formato ISO 8601
  const morningStart = new Date(`${date}T06:00:00`); // 6 AM
  const morningEnd = new Date(`${date}T14:00:00`); // 2 PM

  const eveningStart = new Date(`${date}T14:00:00`); // 2 PM
  const eveningEnd = new Date(`${date}T22:00:00`); // 10 PM

  // Consultas SQL
  const morningQuery = `
        SELECT SUM(sd.quantity * sd.unit_price) as total_sales
        FROM sales s
        JOIN sale_details sd ON s.id = sd.sale_id
        WHERE s.date_time BETWEEN ? AND ?
      `;

  const eveningQuery = `
        SELECT SUM(sd.quantity * sd.unit_price) as total_sales
        FROM sales s
        JOIN sale_details sd ON s.id = sd.sale_id
        WHERE s.date_time BETWEEN ? AND ?
      `;

  try {
    // Ejecutar las consultas
    const [morningResults] = await pool.query(morningQuery, [
      morningStart,
      morningEnd,
    ]);
    const [eveningResults] = await pool.query(eveningQuery, [
      eveningStart,
      eveningEnd,
    ]);

    res.json({
      morning_sales: morningResults[0]?.total_sales || 0,
      evening_sales: eveningResults[0]?.total_sales || 0,
    });
  } catch (error) {
    console.error("Error fetching sales cuts:", error);
    res.status(500).json({ error: "Error fetching sales cuts" });
  }
});

module.exports = router;
