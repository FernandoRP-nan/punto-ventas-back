module.exports = (sequelize, DataTypes) => {
  const Sale = sequelize.define("Sale", {
    cashier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date_time: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
    },
  });

  Sale.associate = (models) => {
    Sale.belongsTo(models.User, { foreignKey: "cashier_id" });
    Sale.hasMany(models.SaleDetail, { foreignKey: "sale_id" });
  };

  return Sale;
};
