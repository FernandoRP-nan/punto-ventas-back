module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("Log", {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });

  Log.associate = (models) => {
    // Relación con el usuario que ejecutó la acción
    Log.belongsTo(models.User, {
      foreignKey: "userId",
      allowNull: false,
    });
  };

  return Log;
};
