import React, { useState } from 'react';
const API_BASE_URL = 'http://localhost:4000/api/auth';

function Auth({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función renombrada y simplificada
  const autenticar = async (e) => {
    e.preventDefault();

    const endpoint = isRegistering ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
    const payload = { email, password };
    
    // Petición al Backend
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        // Alerta en caso de error de la API
        alert(data.error || 'Fallo de autenticación.');
        return;
    }
    // 

    if (!isRegistering) {
        // Login exitoso: Guarda el token y cambia el estado en App.jsx
        onLoginSuccess(data.token, data.userId);
    } else {
        // Registro exitoso: Muestra alerta y cambia a vista de Login
        alert("Registro exitoso. ¡Ahora inicia sesión!");
        setIsRegistering(false);
    }
  };

  return (
    <div className="auth-container">
      <h3>{isRegistering ? 'Registrarse' : 'Iniciar Sesión'}</h3>

      {/* Uso de la función 'autenticar' */}
      <form onSubmit={autenticar}>
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isRegistering ? 'Crear Cuenta' : 'Entrar'}</button>
      </form>

      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Volver al Login' : '¿No tienes cuenta? Regístrate'}
      </button>
    </div>
  );
}

export default Auth;