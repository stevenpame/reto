import React, { useState } from 'react';

// Nota: La URL base se ha cambiado de 5000 a 4000 en tu código proporcionado.
const API_BASE_URL = 'http://localhost:4000/api'; 

function Disponibilidad({ authToken }) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [equipos, setEquipos] = useState([]);
  // const [statusMessage, setStatusMessage] = useState(''); // Eliminado

  // --- FUNCIÓN DE BÚSQUEDA SIMPLIFICADA (buscar) ---
  const buscar = async (e) => {
    e.preventDefault();

    // Petición GET al endpoint público
    const response = await fetch(
      `${API_BASE_URL}/equipos/disponibilidad?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
    );
      
    const data = await response.json();

    if (!response.ok) {
        // Manejo de error de la API con alert
        alert(data.error || 'Error al buscar disponibilidad.');
        return;
    }

    setEquipos(data);
    if (data.length === 0) {
        alert("No hay equipos disponibles.");
    }
  };

  // --- FUNCIÓN DE RESERVA SIMPLIFICADA (reservar) ---
  const reservar = async (equipoId) => {
    if (!authToken) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }
    
    // Petición POST al endpoint protegido
    const response = await fetch(`${API_BASE_URL}/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` // Token de autorización
      },
      body: JSON.stringify({ 
        equipo_id: equipoId, 
        fecha_inicio: fechaInicio, 
        fecha_fin: fechaFin 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        // Manejo de error de la API (ej. Conflicto 409)
        alert(data.error || 'Fallo la reserva.');
        return;
    }

    alert(`✅ Reserva exitosa: ${data.reserva.id}.`);
    // Ocultar el equipo recién reservado de la lista
    setEquipos(prev => prev.filter(e => e.id !== equipoId)); 
  };

  // El JSX que se muestra en pantalla
  return (
    <div className="disponibilidad-container">
      <h3>1. Buscar Equipos Disponibles</h3>
      
      {/* Uso de la función 'buscar' en el onSubmit */}
      <form onSubmit={buscar}>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required />
        <button type="submit">Buscar</button>
      </form>

      {/* {statusMessage && <p>{statusMessage}</p>} <-- Eliminado */}

      <div className="equipos-list">
        <h4>Resultados:</h4>
        {equipos.map((equipo) => (
          <div key={equipo.id} className="equipo-card">
            <h5>{equipo.nombreEquipo}</h5>
            <p>Inventario: {equipo.numInventario}</p>
            
            {/* Uso de la función 'reservar' en el onClick */}
            <button 
              onClick={() => reservar(equipo.id)}
              disabled={!authToken} 
            >
              {authToken ? 'Reservar Ahora' : 'Inicia Sesión'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Disponibilidad;