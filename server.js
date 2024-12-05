const express = require("express");
const cors = require('cors'); // Importar el middleware CORS
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv");

// Configuración de variables de entorno
dotenv.config();

app.use(cors());

// Middlewares
app.use(bodyParser.json());

// Rutas
app.use("/auth", require("./routes/auth"));
app.use("/inventory", require("./routes/inventory"));
app.use("/sales", require("./routes/sales"));

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
