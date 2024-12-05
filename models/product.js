module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
    },
  });

  // Relación con otros modelos
  Product.associate = (models) => {
    Product.hasMany(models.SaleDetail, { foreignKey: "product_id" });
    Product.hasMany(models.InventoryLog, { foreignKey: "product_id" });
  };

  return Product;
};
