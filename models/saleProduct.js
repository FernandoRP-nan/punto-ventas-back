module.exports = (sequelize, DataTypes) => {
  const SaleProduct = sequelize.define("SaleProduct", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  SaleProduct.associate = (models) => {
    // Relación con la venta
    SaleProduct.belongsTo(models.Sale, {
      foreignKey: "saleId",
      allowNull: false,
    });

    // Relación con el producto
    SaleProduct.belongsTo(models.Product, {
      foreignKey: "productId",
      allowNull: false,
    });
  };

  return SaleProduct;
};


