const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // Asegúrate de tener el archivo db.js configurado
const { Product } = require("../models/product"); // Modelo Sequelize para Product
const { InventoryLog } = require("../models/inventoryLog"); // Modelo Sequelize para Product

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
    const [result] = await pool.execute(
      "INSERT INTO products (name, stock, max_stock, cost, sale_price) VALUES (?, ?, ?, ?, ?)",
      [name, stock, max_stock, cost, sale_price]
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
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Crear un nuevo movimiento de inventario
    const inventoryLog = await InventoryLog.create({
      product_id,
      type,
      quantity,
    });

    // Actualizar el stock del producto
    if (type === "ENTRADA") {
      product.stock += quantity;
    } else if (type === "SALIDA") {
      product.stock -= quantity;
    }

    await product.save();
    res.status(201).json(inventoryLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
