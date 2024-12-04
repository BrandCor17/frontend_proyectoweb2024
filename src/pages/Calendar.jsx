import React, { useState, useEffect } from "react";
import Header from "../components/General/Header";
import Sidebar from "../components/General/Sidebar";
import EventItem from "../components/General/EventItem";
import AddButton from "../components/General/AddButton"
import "./styles/Calendar.css";

const Calendar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      console.log("Iniciando solicitud para obtener eventos de los cursos donde el usuario está inscrito...");
      try {
        const apiUrl = import.meta.env.VITE_BASE_URL; // Usando la variable de entorno
        const response = await fetch(`${apiUrl}/api/events/events/user`, { 
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        console.log("Respuesta completa de eventos:", response);
        if (!response.ok) {
          throw new Error(`Error al obtener eventos: ${response.status} - ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log("Eventos recibidos:", data);
  
        if (data.length === 0) {
          console.log("No se encontraron eventos.");
        }
  
        setEvents(data);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchEvents();
  }, []);
  
  return (
    <div className="principal-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isOpen} />

      <div className="calendar-container">
        <h2>Eventos de tus Cursos</h2>

        <AddButton />

        {loading ? (
          <p>Cargando eventos...</p>
        ) : events.length === 0 ? (
          <p>No hay eventos disponibles para tus cursos</p>
        ) : (
          <ul>
            {events.map((event) => (
              <EventItem key={event._id} event={event} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Calendar;