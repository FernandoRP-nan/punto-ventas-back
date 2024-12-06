const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Obtener el token del encabezado

  if (!token) return res.sendStatus(401); // Si no hay token, devuelve 401

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Si el token no es válido, devuelve 403
    req.user = user; // Almacena la información del usuario en req.user
    next(); // Llama al siguiente middleware o ruta
  });
};

module.exports = authenticateToken;
