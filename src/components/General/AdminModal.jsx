import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AdminModal.css"
const URL = import.meta.env.VITE_BASE_URL;

const AdminModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    secretKey: '',
    name: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { secretKey, name, email, password } = formData;
    const data = { secretKey, name, email, password };

    setLoading(true);

    try {
      const response = await axios.post(`${URL}/api/users/create-admin`, data, {
        headers: {
          'Content-Type': 'application/json',
          // Si necesitas autenticación con token, descomenta la siguiente línea:
          // Authorization: `Bearer ${getToken()}`,
        },
      });

      if (response?.data?.message) {
        toast.success(response.data.message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
        });
        onClose(); // Cerrar modal
      } else {
        toast.error('Error al registrar el administrador', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: true,
        });
      }
    } catch (err) {
      toast.error(`Error: ${err?.message || 'No se pudo completar el registro'}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null; // No renderizar si el modal está cerrado

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Registrar Administrador</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Secret Key:</label>
            <input
              type="text"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Registrar'}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminModal;
