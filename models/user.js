module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("GERENTE", "CAJERO"),
      allowNull: false,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Sale, { foreignKey: "cashier_id" });
  };

  return User;
};
