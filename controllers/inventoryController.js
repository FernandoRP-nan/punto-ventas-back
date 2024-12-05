const pool = require("../config/db");

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(`SELECT * FROM products`);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
};

exports.addProduct = async (req, res) => {
  const { name, stock, max_stock, cost, sale_price } = req.body;

  try {
    await pool.query(
      `INSERT INTO products (name, stock, max_stock, cost, sale_price) VALUES (?, ?, ?, ?, ?)`,
      [name, stock, max_stock, cost, sale_price]
    );
    res.status(201).json({ message: "Producto añadido exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al añadir el producto", error });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, stock, max_stock, cost, sale_price } = req.body;

  try {
    await pool.query(
      `UPDATE products SET name = ?, stock = ?, max_stock = ?, cost = ?, sale_price = ? WHERE id = ?`,
      [name, stock, max_stock, cost, sale_price, id]
    );
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

exports.addStock = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const [product] = await pool.query(`SELECT * FROM products WHERE id = ?`, [
      productId,
    ]);

    if (product.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const updatedStock = product[0].stock + quantity;

    if (updatedStock > product[0].max_stock) {
      return res
        .status(400)
        .json({ message: "No se puede exceder el stock máximo" });
    }

    await pool.query(`UPDATE products SET stock = ? WHERE id = ?`, [
      updatedStock,
      productId,
    ]);
    res.json({ message: "Stock añadido exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al añadir stock", error });
  }
};
