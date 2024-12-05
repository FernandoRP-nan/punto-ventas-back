const pool = require("../config/db");

exports.createSale = async (req, res) => {
  const { cashierId, items } = req.body;

  try {
    let totalAmount = 0;

    for (const item of items) {
      const [product] = await pool.query(
        `SELECT * FROM products WHERE id = ?`,
        [item.productId]
      );

      if (product.length === 0 || product[0].stock < item.quantity) {
        return res
          .status(400)
          .json({ message: "Stock insuficiente o producto no encontrado" });
      }

      totalAmount += item.quantity * product[0].sale_price;
      await pool.query(`UPDATE products SET stock = stock - ? WHERE id = ?`, [
        item.quantity,
        item.productId,
      ]);
    }

    const [saleResult] = await pool.query(
      `INSERT INTO sales (cashier_id, total_amount) VALUES (?, ?)`,
      [cashierId, totalAmount]
    );

    for (const item of items) {
      await pool.query(
        `INSERT INTO sale_details (sale_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
        [saleResult.insertId, item.productId, item.quantity, item.unit_price]
      );
    }

    res.json({ message: "Venta realizada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al realizar la venta", error });
  }
};

exports.getSales = async (req, res) => {
  try {
    const [sales] = await pool.query(`SELECT * FROM sales`);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas", error });
  }
};
