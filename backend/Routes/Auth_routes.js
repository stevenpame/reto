// src/routes/auth.routes.js

const express = require('express');
const router = express.Router(); // Crea una instancia de router de Express

// ---------------------------------------------------------------------------------
// ENDPOINT: Registro de Usuario (POST /api/auth/register)
// ---------------------------------------------------------------------------------
router.post('/register', async (req, res) => {
    const { email, password, nombre } = req.body;
    
    // 1. Hashing de la contraseña (Usando marcador de posición)
    const passwordHash = req.hashPasswordSeguro(password); 
    
    // 2. Creación del usuario en la base de datos usando Prisma
    // Prisma garantiza la validación de campos únicos (ej. email)
    const nuevoUsuario = await req.prisma.usuario.create({
        data: {
            email,
            nombre,
            passwordHash,
        },
    });
    
    res.status(201).json({ message: 'Usuario registrado con éxito', userId: nuevoUsuario.id });
});

// ---------------------------------------------------------------------------------
// ENDPOINT: Inicio de Sesión (POST /api/auth/login)
// ---------------------------------------------------------------------------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Buscar usuario por email (campo unique)
    const usuario = await req.prisma.usuario.findUnique({ where: { email } });

    // 2. Verificar existencia del usuario y la contraseña (Usando marcador)
    if (!usuario || !req.verificarPasswordSeguro(password, usuario.passwordHash)) {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 3. Generar y devolver el token JWT
    const token = req.generarTokenJWT(usuario.id);

    res.status(200).json({ token, userId: usuario.id });
});

module.exports = router;