const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const [products] = await pool.execute("SELECT * FROM products");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un producto
router.post("/", async (req, res) => {
  const { name, stock, max_stock, cost, sale_price } = req.body;
  try {
    // Insertar el nuevo producto
    const [result] = await pool.execute(
      "INSERT INTO products (name, stock, max_stock, cost, sale_price) VALUES (?, ?, ?, ?, ?)",
      [name, stock, max_stock, cost, sale_price]
    );

    // Registrar el movimiento de inventario
    await pool.execute(
      "INSERT INTO inventory_movement_logs (product_id, action, quantity) VALUES (?, ?, ?)",
      [result.insertId, "ENTRADA", stock] // Asumiendo que el stock inicial es la cantidad añadida
    );

    const newProduct = {
      id: result.insertId,
      name,
      stock,
      max_stock,
      cost,
      sale_price,
    };
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, stock, max_stock, cost, sale_price } = req.body;
  try {
    const [product] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await pool.execute(
      "UPDATE products SET name = ?, stock = ?, max_stock = ?, cost = ?, sale_price = ? WHERE id = ?",
      [name, stock, max_stock, cost, sale_price, id]
    );
    res.json({ id, name, stock, max_stock, cost, sale_price });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [product] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    if (product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Registrar un movimiento de inventario (ENTRADA o SALIDA)
router.post("/inventory", async (req, res) => {
  const { product_id, type, quantity } = req.body;
  try {
    // Verificar si el producto existe
    const [product] = await pool.execute(
      "SELECT * FROM products WHERE id = ?",
      [product_id]
    );
    if (product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Crear un nuevo movimiento de inventario
    const [inventoryLogResult] = await pool.execute(
      "INSERT INTO inventory_movement_logs (product_id, type, quantity) VALUES (?, ?, ?)",
      [product_id, type, quantity]
    );

    // Actualizar el stock del producto
    let newStock;
    if (type === "ENTRADA") {
      newStock = product[0].stock + quantity;
    } else if (type === "SALIDA") {
      newStock = product[0].stock - quantity;
    } else {
      return res.status(400).json({ message: "Tipo de movimiento inválido" });
    }

    // Actualizar el stock en la base de datos
    await pool.execute("UPDATE products SET stock = ? WHERE id = ?", [
      newStock,
      product_id,
    ]);

    res.status(201).json({
      message: "Movimiento de inventario registrado",
      inventoryLogId: inventoryLogResult.insertId,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los movimientos de inventario
router.get("/inventory-logs", async (req, res) => {
  try {
    const [logs] = await pool.execute("SELECT * FROM inventory_movement_logs");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
