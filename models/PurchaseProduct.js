module.exports = (sequelize, DataTypes) => {
  const PurchaseProduct = sequelize.define("PurchaseProduct", {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  return PurchaseProduct;
};
