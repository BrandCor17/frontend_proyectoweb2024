import React, { useState } from "react";
import axios from "axios";
import './formRequest.css'

const RequestInstructorRole = () => {
  const [cum, setCum] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del CUM
    if (cum < 0 || cum > 10) {
      setMessage({ type: "error", text: "El CUM debe estar entre 0 y 10." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token"); 

      if (!token) {
        setMessage({ type: "error", text: "Usuario no autenticado." });
        setLoading(false);
        return;
      }

      const API_URL = import.meta.env.VITE_BASE_URL;

      const response = await axios.put(
        `${API_URL}/api/users/request-role`, 
        { cum },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      setMessage({ type: "success", text: response.data.message });
      setCum(""); 
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Hubo un error al enviar la solicitud.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-role-container">
  <h2 className="request-title">Solicitar Rol de Instructor</h2>
  <form onSubmit={handleSubmit} className="request-form">
    <div className="input-group">
      <label htmlFor="cum" className="input-label">
        CUM (0-10):
      </label>
      <input
        type="number"
        id="cum"
        value={cum}
        onChange={(e) => setCum(e.target.value)}
        placeholder="Ingresa tu CUM"
        required
        className="input-field"
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      className={`submit-btn ${loading ? 'loading' : ''}`}
    >
      {loading ? "Enviando..." : "Enviar Solicitud"}
    </button>
  </form>
  {message && (
    <div
      className={`message ${message.type === "error" ? "error" : "success"}`}
    >
      {message.text}
    </div>
  )}
</div>

  );
};

export default RequestInstructorRole;
