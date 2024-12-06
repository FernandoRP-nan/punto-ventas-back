const fs = require("fs");
const path = require("path");
const pool = require("../config/db");
const Sequelize = require("sequelize");

// Establece la conexión a la base de datos con Sequelize
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  pool: {
    max: 5, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones
    acquire: 30000, // Tiempo máximo de espera antes de lanzar error por falta de conexión
    idle: 10000, // Tiempo máximo de inactividad para las conexiones
  },
});

const models = {};

// Lee todos los archivos en la carpeta "models"
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js") // Excluye este archivo
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    models[model.name] = model;
  });

models.Product.associate && models.Product.associate(models);
models.Sale.associate && models.Sale.associate(models);


module.exports = { sequelize, Sequelize, models };
