import { useState } from 'react';
const API_BASE_URL = 'http://localhost:3000/api/auth';

function Auth({ onLoginSuccess }) {
  const [isRegistro, setIsRegistro] = useState(false); // Nuevo estado para alternar entre Login y Registro 
  const [email, setEmail] = useState(''); // contante del correo electrónico
  const [password, setPassword] = useState(''); // contante de la contraseña

  // Función renombrada y simplificada
  const autenticar = async (e) => {
    e.preventDefault();

    // Uso de la nueva variable: isRegistro
    const endpoint = isRegistro ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`; // Determina el endpoint según la acción
    const payload = { email, password }; // Datos comunes para ambas acciones 
    
    // Petición al Backend
    const response = await fetch(endpoint, { // Uso de la variable endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // Uso de la variable payload
    });

    const data = await response.json();

    if (!response.ok) {
        // Alerta en caso de error de la API
        alert(data.error || 'Fallo de autenticación.');
        return;
    }
    
    // Uso de la nueva variable: isRegistro
    if (!isRegistro) {
        // Login exitoso: Guarda el token y cambia el estado en App.jsx
        onLoginSuccess(data.token, data.userId);
    } else {
        // Registro exitoso: Muestra alerta y cambia a vista de Login
        alert("Registro exitoso. ¡Ahora inicia sesión!");
        setIsRegistro(false); // Cambia de vuelta a Login
    }
  };

  return (
    <div className="auth-container">
      {/* Uso de la nueva variable en el título */}
      <h3>{isRegistro ? 'Registrarse' : 'Iniciar Sesión'}</h3>

      {/* Uso de la función 'autenticar' */}
      <form onSubmit={autenticar}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {/* Uso de la nueva variable en el botón de submit */}
        <button type="submit">{isRegistro ? 'Crear Cuenta' : 'Entrar'}</button>
      </form>

      {/* Uso de la nueva variable y su setter en el botón de alternancia */}
      <button onClick={() => setIsRegistro(!isRegistro)}>
        {isRegistro ? 'Volver al Login' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
}


export default Auth;