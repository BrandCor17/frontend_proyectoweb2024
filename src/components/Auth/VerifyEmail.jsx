import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import usePost from '../../hooks/usePost';
import './styles/VerifyEmail.css'; 

const URL = import.meta.env.VITE_BASE_URL;

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || '';
    const [verificationCode, setVerificationCode] = useState('');
    const { postData, error, loading } = usePost(`${URL}/api/users/verify-email`);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await postData({ email, verificationCode });

            if (res?.message) {
                alert(res.message); 
                navigate('/'); 
            } else {
                alert('Error: No se recibió una respuesta válida del servidor.');
            }
        } catch (err) {
            console.error('Error al verificar el correo:', err);
            alert('Error: ' + (err?.message || 'No se pudo verificar el correo.'));
        }
    };

    return (
        <div className="modal-overlay">
  <div className="modal-container">
    <h2>Verificar correo electrónico</h2>
    <p>
      Por favor ingresa el código de verificación que enviamos a: <strong>{email}</strong>
    </p>
    <form onSubmit={handleSubmit} className="modal-form">
      <label htmlFor="verificationCode">Código de verificación:</label>
      <input
        type="text"
        id="verificationCode"
        name="verificationCode"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        required
        placeholder="Ingresa tu código"
        className="modal-input"
      />
      <button type="submit" disabled={loading} className="modal-button">
        {loading ? "Verificando..." : "Verificar"}
      </button>
    </form>
    {error && <p className="error-message">{error}</p>}
  </div>
</div>

    );
};

export default VerifyEmail;
