import React, { useState } from 'react';
import axios from 'axios';
import "./styles/createCourseForm.css";

const CrearCurso = ({ onClose }) => { 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cursoData = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()), 
    };

    const token = localStorage.getItem('token');

    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;  // Usando la variable de entorno
      const response = await axios.post(`${apiUrl}/api/courses/create`, cursoData, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });
      console.log('Curso creado:', response.data);
      onClose(); 
    } catch (error) {
      console.error('Error al crear el curso:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="unique-create-course-form">
      <div className="unique-form-group">
        <label className="unique-form-label">Título del curso:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="unique-form-input"
        />
      </div>

      <div className="unique-form-group">
        <label className="unique-form-label">Descripción del curso:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="unique-form-textarea"
        />
      </div>

      <div className="unique-form-group">
        <label className="unique-form-label">Etiquetas:</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="React, Frontend, JavaScript"
          className="unique-form-input"
        />
      </div>

      <button type="submit" className="unique-form-button">Crear curso</button>
    </form>
  );
};

export default CrearCurso;
