import  { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:4000/api/reservas';

function MisReservas({ authToken }) {
  const [reservas, setReservas] = useState([]);// estado para almacenar las reservas del usuario
  

  // useEffect para cargar las reservas cuando el componente se monta o cambia authToken
  useEffect(() => {
    if (authToken) {
      fetchReservas();
    } else {
      setReservas([]);
    }
  }, [authToken]); // Se vuelve a ejecutar si cambia authToken

  // función para obtener las reservas activas del usuario

  const fetchReservas = async () => {
    
    
    // Petición GET al endpoint protegido (Sin try/catch)
    const response = await fetch(`${API_BASE_URL}/mis-activas`, {
      headers: {
        // Incluir el Token para que el Backend identifique al usuario
        'Authorization': `Bearer ${authToken}` 
      }
    });

    const data = await response.json();
    // se muestra una alerta en caso de error al cargar las reservas
    if (!response.ok) {
        alert(data.error || "Fallo al cargar la lista de reservas.");
        return; 
    }

    setReservas(data);
  };

  // este  muestra la lista de reservas del usuario
  return (
    <div className="reservas-container">
      <h3>2. Mis Reservas Activas</h3>
      
      
      // Mostramos las reservas o un mensaje si no hay reservas
      {reservas.length > 0 ? (
        <div className="reservas-list">
          {reservas.map((reserva) => (
            <div key={reserva.id} className="reserva-card">
              <h4>{reserva.equipo_nombre}</h4>
              <p>Inventario: {reserva.num_inventario}</p>
              <p>Periodo: {reserva.fecha_inicio} al {reserva.fecha_fin}</p>
            </div>
          ))}
        </div>
      ) : (
        // Mostrar mensaje si no hay reservas activas
        authToken && (<p>No tienes reservas activas.</p>)
      )}
    </div>
  );
}

export default MisReservas;