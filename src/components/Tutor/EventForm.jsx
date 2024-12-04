import React, { useState, useEffect } from "react";
import "./EventForm.css";

const URL = import.meta.env.VITE_BASE_URL;

const EventForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    courseId: '', 
  });

  const [courses, setCourses] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null); 

      try {
        const response = await fetch(`${URL}/api/courses/user-courses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los cursos.");
        }

        const data = await response.json();
        setCourses(data); 
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("Hubo un problema al cargar los cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.courseId) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${URL}/api/events/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error al crear el evento");
      }

      const data = await response.json();
      console.log("Evento creado con éxito:", data);

      onClose();
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("Hubo un error al crear el evento.");
    }
  };

  return (
    <div className="event-form-modal">
  <div className="event-form-container">
    <h2 className="event-form-title">Nuevo Evento</h2>
    <form onSubmit={handleSubmit}>
      <div className="event-input-group">
        <label htmlFor="title" className="event-input-label">Título:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="event-input"
        />
      </div>

      <div className="event-input-group">
        <label htmlFor="description" className="event-input-label">Descripción:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="event-textarea"
        ></textarea>
      </div>

      <div className="event-input-group">
        <label htmlFor="date" className="event-input-label">Fecha:</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="event-input"
        />
      </div>

      <div className="event-input-group">
        <label htmlFor="courseId" className="event-input-label">Curso:</label>
        {loading ? (
          <p className="event-loading-text">Cargando cursos...</p>
        ) : error ? (
          <p className="event-error-message">{error}</p>
        ) : courses.length === 0 ? (
          <p className="event-no-courses">No tienes cursos disponibles.</p>
        ) : (
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            className="event-select"
          >
            <option value="" disabled>Selecciona un curso</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="event-form-actions">
        <button type="submit" className="event-button">
          Crear Evento
        </button>
        <button type="button" className="close-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default EventForm;
