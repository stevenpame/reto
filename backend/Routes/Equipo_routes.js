

const express = require('express');
const router = express.Router();

const parseDate = (dateString) => new Date(dateString); // Función auxiliar para convertir string a objeto Date

// ---------------------------------------------------------------------------------
// ENDPOINT: Consultar Disponibilidad (GET /api/equipos/disponibilidad?fecha_inicio=...&fecha_fin=...)
// ---------------------------------------------------------------------------------
router.get('/disponibilidad', async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;

    const reqStart = parseDate(fecha_inicio);
    const reqEnd = parseDate(fecha_fin);

    // 1. Consulta crucial de solapamiento: Identificar los IDs de los equipos ocupados.
    // Lógica: Si la reserva termina después de que mi solicitud inicia (gt: reqStart)
    //         Y la reserva inicia antes de que mi solicitud termine (lt: reqEnd),
    //         hay un conflicto y el equipo está ocupado.
    const reservasSolapadas = await req.prisma.reserva.findMany({
        where: {
            estadoReserva: 'activa',
            fechaFinReserva: { gt: reqStart },
            fechaInicioReserva: { lt: reqEnd },
        },
        select: { equipoId: true } // Solo recuperamos el ID del equipo, optimizando la consulta
    });

    const equiposOcupadosIds = reservasSolapadas.map(r => r.equipoId);

    // 2. Consultar el catálogo de equipos, excluyendo los IDs ocupados
    const equiposDisponibles = await req.prisma.equipo.findMany({
        where: {
            id: { notIn: equiposOcupadosIds } // Usa el filtro 'notIn' de Prisma
        }
    });

    res.json(equiposDisponibles);
});

module.exports = router;