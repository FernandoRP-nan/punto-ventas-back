module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define("Purchase", {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });

  Purchase.associate = (models) => {
    // Relación con el proveedor (Supplier)
    Purchase.belongsTo(models.Supplier, {
      foreignKey: "supplierId",
      allowNull: false,
    });

    // Relación con los productos comprados
    Purchase.belongsToMany(models.Product, {
      through: models.PurchaseProduct,
      foreignKey: "purchaseId",
    });
  };

  return Purchase;
};
