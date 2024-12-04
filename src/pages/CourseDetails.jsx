import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import "./styles/CourseDetails.css";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import { AuthContext } from "../contexts/authContext";

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    resources: [], 
  });

  const [resourceUrl, setResourceUrl] = useState(""); 

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BASE_URL;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSection((prevSection) => ({
      ...prevSection,
      [name]: value,
    }));
  };

  const handleResourceChange = (e) => {
    setResourceUrl(e.target.value);
  };

  const addResource = () => {
    if (resourceUrl) {
      setNewSection((prevSection) => ({
        ...prevSection,
        resources: [
          ...prevSection.resources,
          { type: "link", url: resourceUrl },
        ],
      }));
      setResourceUrl(""); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${apiUrl}/api/courses/${courseId}/sections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSection),
      });

      if (response.ok) {
        const updatedCourse = await response.json();
        setCourse(updatedCourse);
        setIsModalOpen(false); // Cerrar el modal
      } else {
        console.error("Error al agregar la sección");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
    }
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
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                          {resource.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {user?.role === "instructor" && (
        <button className="instructor-button" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Agregar Nueva Sección</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Título de la sección</label>
                <input
                  type="text"
                  name="title"
                  value={newSection.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>URL del recurso</label>
                <input
                  type="text"
                  value={resourceUrl}
                  onChange={handleResourceChange}
                  required
                />
              </div>
              <button type="button" onClick={addResource}>
                Agregar Recurso
              </button>
              <div>
                <ul>
                  {newSection.resources.map((res, index) => (
                    <li key={index}>
                      {res.url}
                    </li>
                  ))}
                </ul>
              </div>
              <button type="submit">Agregar Sección</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
