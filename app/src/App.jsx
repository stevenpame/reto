import { useState } from 'react';
import Auth from './componentes/Auth';
import Disponibilidad from './componentes/Disponibilidad';
import MisReservas from './componentes/Reservas';

function App() {
  // Manejo del estado de autenticación
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  // Función para manejar el éxito del login
  const loginSuccess = (token, id) => {
    // Persistir el token y el ID en el almacenamiento local y en el estado
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
    setAuthToken(token);
    setUserId(id);
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setAuthToken(null);
    setUserId(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Reserva de Equipos</h1>
        {authToken ? (
          <div>
            <span className="user-info">Usuario ID: {userId}</span>
            <button onClick={logout}>Cerrar Sesión</button>
          </div>
        ) : (
          <Auth onLoginSuccess={loginSuccess} />
        )}
      </header>
      
      <main>
        
        <Disponibilidad authToken={authToken} />
        
        <hr />

       
        {authToken && <MisReservas authToken={authToken} />}
      </main>
    </div>
  );
}

export default App;
