module.exports = (sequelize, DataTypes) => {
  const InventoryLog = sequelize.define("InventoryLog", {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("ENTRADA", "SALIDA"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW,
    },
  });

  InventoryLog.associate = (models) => {
    InventoryLog.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return InventoryLog;
};
