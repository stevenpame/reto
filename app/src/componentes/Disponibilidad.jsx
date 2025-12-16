import  { useState } from 'react';


const API_BASE_URL = 'http://localhost:3000/api'; 

function Disponibilidad({ authToken }) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [equipos, setEquipos] = useState([]);


  //  FUNCIÓN DE BÚSQUEDA 
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
// Actualizamos la lista de equipos disponibles
    setEquipos(data);
    if (data.length === 0) {
        alert("No hay equipos disponibles.");
    }
  };
  // FUNCIÓN DE RESERVA 
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
      // Enviamos los datos en el cuerpo de la petición
      body: JSON.stringify({ 
        equipo_id: equipoId, 
        fecha_inicio: fechaInicio, 
        fecha_fin: fechaFin 
      }),
    });
// Obtener la respuesta en formato JSON
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

  // JSX del componente
  return (
    <div className="disponibilidad-container">
      <h3>1. Buscar Equipos Disponibles</h3>
      
      // Formulario de búsqueda
      <form onSubmit={buscar}>
        <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required /> // Fecha de inicio
        <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} required /> // Fecha de fin
        <button type="submit">Buscar</button> // Botón de búsqueda
      </form>

     
    // Mostrar resultados de búsqueda
      <div className="equipos-list"> 
        <h4>Resultados:</h4>
        {equipos.map((equipo) => ( //  los equipos disponibles
          <div key={equipo.id} className="equipo-card"> // Tarjeta de equipo
            <h5>{equipo.nombreEquipo}</h5>
            <p>Inventario: {equipo.numInventario}</p> // Detalles del equipo
            
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