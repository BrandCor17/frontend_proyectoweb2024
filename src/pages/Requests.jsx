import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Requests.css";
import Header from "../components/General/Header";
import Sidebar from "../components/General/Sidebar";

const Requests = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fetchSolicitudes = async () => {
    console.log("Iniciando solicitud para obtener solicitudes...");
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL; // Usar la variable de entorno para la URL base
      const response = await fetch(`${apiUrl}/api/users/pending-requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (response.status === 404) {
        setError("No hay solicitudes pendientes.");
        setSolicitudes([]);
      }
  
      const data = await response.json();
      console.log("Solicitudes recibidas:", data);
      setSolicitudes(data);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
      setError("Hubo un problema al cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (id) => {
    console.log("Aprobando solicitud con ID:", id);
  
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL; // Usar la variable de entorno para la URL base
      const response = await fetch(`${apiUrl}/api/users/approve-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al aprobar solicitud: ${response.status} - ${response.statusText}`);
      }
  
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.filter((solicitud) => solicitud._id !== id)
      );
  
      console.log("Solicitud aprobada con éxito.");
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
      setError("Hubo un problema al aprobar la solicitud.");
    }
  };
  




  useEffect(() => {
    fetchSolicitudes();
  }, []);

  return (
    <div className="unique-principal-container">
  <Header toggleSidebar={toggleSidebar} />
  <Sidebar isOpen={isOpen} />

  <div className="unique-solicitudes-container">
    <h2>Solicitudes para Rol de Instructor</h2>

    {loading ? (
      <p>Cargando solicitudes...</p>
    ) : error ? (
      <p className="unique-error">{error}</p>
    ) : solicitudes.length === 0 ? (
      <p>No hay solicitudes pendientes.</p>
    ) : (
      <>
        <table className="unique-solicitudes-table">
          <thead>
            <tr>
              <th>Nombre:</th>
              <th>CUM:</th>
              <th>Acciones:</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((solicitud) => (
              <tr key={solicitud._id}>
                <td>{solicitud.name}</td>
                <td>{solicitud.roleRequest.cum}</td>
                <td className="unique-solicitudes-buttons">
                  <button
                    className="unique-approve"
                    onClick={() => handleApprove(solicitud._id)}
                  >
                    ✓
                  </button>

                  <button
                    className="unique-reject"
                    onClick={() => handleReject(solicitud._id)}
                  >
                    ✗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}
  </div>
</div>


  );
};

export default Requests;
