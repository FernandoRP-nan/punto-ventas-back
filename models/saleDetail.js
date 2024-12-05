module.exports = (sequelize, DataTypes) => {
  const SaleDetail = sequelize.define("SaleDetail", {
    sale_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  SaleDetail.associate = (models) => {
    SaleDetail.belongsTo(models.Sale, { foreignKey: "sale_id" });
    SaleDetail.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return SaleDetail;
};
