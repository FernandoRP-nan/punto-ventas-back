const express = require("express");
const router = express.Router();
const {
  Sale,
  SaleProduct,
  Product,
} = require("../models/sale", "../models/saleProduct", "../models/product"); // Modelos Sequelize

// Registrar una venta
router.post("/", async (req, res) => {
  const { cashier_id, products } = req.body;
  try {
    const sale = await Sale.create({ cashier_id });
    for (const product of products) {
      await SaleProduct.create({
        sale_id: sale.id,
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price: product.unit_price,
      });

      // Disminuir stock
      const productInstance = await Product.findByPk(product.product_id);
      if (productInstance) {
        productInstance.stock -= product.quantity;
        await productInstance.save();
      }
    }
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener historial de ventas
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.findAll({ include: SaleProduct });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
