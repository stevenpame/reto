
const express = require('express');
const router = express.Router();

// Middleware SIMPLIFICADO de Token (sin función auxiliar)
const verificarToken = (req, res, next) => {
    // Si el token no es Bearer, se deniega el acceso.
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token requerido.' });
    }
    // Asigna un ID de usuario fijo (simulado)
    req.userId = 'u-1'; 
    next();
};


// ENDPOINT: CREAR RESERVA (POST /api/reservas)

router.post('/', verificarToken, async (req, res) => {
    // Desestructurar y preparar datos
    const { equipo_id, fecha_inicio, fecha_fin } = req.body;
    const { userId: usuario_id, prisma } = req;
    const reqStart = new Date(fecha_inicio); // Conversión directa
    const reqEnd = new Date(fecha_fin);

    // 1. Verificar Colisión (Chequeo directo en la DB)
    const conflicto = await prisma.reserva.findFirst({
        where: {
            equipoId: equipo_id,
            estadoReserva: 'activa',
            fechaFinReserva: { gt: reqStart },
            fechaInicioReserva: { lt: reqEnd },
        }
    });

    if (conflicto) {
        return res.status(409).json({ error: 'Equipo no disponible.' });
    }

    // 2. Crear la Reserva
    const nuevaReserva = await prisma.reserva.create({
        data: {
            usuarioId: usuario_id,
            equipoId: equipo_id,
            fechaInicioReserva: reqStart,
            fechaFinReserva: reqEnd,
            estadoReserva: 'activa'
        }
    });

    res.status(201).json({ message: 'Reserva OK', reserva: nuevaReserva });
});


// ENDPOINT: CONSULTAR RESERVAS ACTIVAS (GET /api/reservas/mis-activas)

router.get('/mis-activas', verificarToken, async (req, res) => {
    const { userId: usuario_id, prisma } = req;
    const fechaActual = new Date();
    
    // 1. Consulta las reservas del usuario, incluyendo el equipo (JOIN)
    const misReservasActivas = await prisma.reserva.findMany({
        where: {
            usuarioId: usuario_id,
            estadoReserva: 'activa',
            fechaFinReserva: { gte: fechaActual }
        },
        include: {
            equipo: {
                select: { nombreEquipo: true, numInventario: true }
            }
        },
        orderBy: { fechaInicioReserva: 'asc' }
    });

    // 2. Formatear la respuesta (uso de map más directo y compacto)
    const resultado = misReservasActivas.map(r => ({
        id: r.id,
        nombre: r.equipo.nombreEquipo,
        inventario: r.equipo.numInventario,
        inicio: r.fechaInicioReserva.toISOString().split('T')[0],
        fin: r.fechaFinReserva.toISOString().split('T')[0],
    }));

    res.json(resultado);
});

module.exports = router;