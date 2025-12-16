// server.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Ruta de bienvenida (endpoint raíz)
app.get('/', (req, res) => {
  res.send('¡Servidor Express en funcionamiento!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});