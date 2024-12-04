import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styles/CourseDetails.css";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BASE_URL; // Usar la variable de entorno para la URL base
        const response = await fetch(`${apiUrl}/api/courses/courses/${courseId}`);
        const data = await response.json();
  
        const sectionsWithExpanded = data.sections.map((section) => ({
          ...section,
          expanded: false,
        }));
  
        setCourse({ ...data, sections: sectionsWithExpanded });
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
  
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);
  
  const toggleSection = (index) => {
    setCourse((prevCourse) => {
      const updatedSections = prevCourse.sections.map((section, idx) =>
        idx === index
          ? { ...section, expanded: !section.expanded }
          : section
      );

      return { ...prevCourse, sections: updatedSections };
    });
  };

  if (!course) {
    return <div>Cargando información del curso...</div>;
  }

  return (
    <div className="custom-container">
  <Header />
  <Sidebar />
  
  <header className="custom-header">
    <h1 className="course-title">{course.title}</h1>
    <p className="course-description">{course.description}</p>
  </header>

  <div className="custom-content">
    <div className="custom-sidebar">
      <h2 className="sidebar-title">Catedráticos:</h2>
      <ul className="sidebar-list">
        {course.catedraticos.length > 0 ? (
          course.catedraticos.map((catedratico, index) => (
            <li key={index} className="sidebar-item">{catedratico.name}</li>
          ))
        ) : (
          <li className="sidebar-item">No asignados</li>
        )}
      </ul>

      <h2 className="sidebar-title">Instructores:</h2>
      <ul className="sidebar-list">
        <li className="sidebar-item">{course.instructor ? course.instructor.name : "No asignado"}</li>
      </ul>
    </div>

    <div className="custom-main">
      {course.sections.map((section, index) => (
        <div key={section._id} className="custom-material">
          <button
            className="material-toggle"
            onClick={() => toggleSection(index)}
          >
            {section.expanded ? "Cerrar" : "Expandir"}
          </button>
          <h3 className="material-title">{section.title}</h3>
          {section.expanded && (
            <div className="material-content">
              <h4 className="resources-title">Recursos:</h4>
              <ul className="resources-list">
                {section.resources.map((resource) => (
                  <li key={resource._id} className="resource-item">
                    {resource.type === "link" ? (
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                        {resource.url}
                      </a>
                    ) : (
                      <a href={resource.url} download className="resource-link">
                        Descargar archivo
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default CourseDetails;
