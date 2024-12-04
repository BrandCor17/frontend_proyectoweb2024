import React, { useEffect, useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import axios from "axios";
import SearchBar from "../components/General/SearchBar";
import "./styles/AssignInstructorPage.css";

const AssignCatedratico = () => {
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catedraticos, setCatedraticos] = useState([]); // Lista de catedráticos
  const [selectedCatedratico, setSelectedCatedratico] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = import.meta.env.VITE_BASE_URL; // Usamos la variable de entorno

  useEffect(() => {
    // Obtener los cursos y el rol del usuario actual
    const fetchData = async () => {
      try {
        // Reemplazamos la URL por la variable de entorno
        const response = await axios.get(`${apiUrl}/api/courses/courses`);
        setCourses(response.data);

        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUserRole(currentUser?.role);
      } catch (error) {
        console.error("Error al obtener los cursos", error);
      }
    };

    fetchData();
  }, []);

  const fetchCatedraticos = async () => {
    try {
      // Usamos la variable de entorno para la URL de los usuarios
      const response = await axios.get(`${apiUrl}/api/users/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const catedraticosList = response.data.filter((user) => user.role === "catedratico");
      setCatedraticos(catedraticosList);
    } catch (error) {
      console.error("Error al obtener los catedráticos:", error);
    }
  };

  const handleAssignCatedratico = async (courseId) => {
    console.log("Abriendo modal para el curso:", courseId);
    setSelectedCourse(courseId);
    await fetchCatedraticos();
    setIsModalOpen(true);
  };

  const handleSelectCatedratico = (catedraticoId) => {
    setSelectedCatedratico(catedraticoId);
  };

  const handleConfirmAssignment = async () => {
    if (selectedCatedratico && selectedCourse) {
      try {
        const response = await axios.patch(
          `${apiUrl}/api/courses/assignCatedratico/${selectedCatedratico}`,
          { courseId: selectedCourse },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("Catedrático asignado:", response.data);

        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al asignar catedrático", error);

        if (error.response && error.response.status === 400) {
          alert("Este catedrático ya está asignado a este curso.");
        } else {
          alert("Hubo un error al asignar el catedrático. Intenta nuevamente.");
        }
      }
    }
  };

  const filteredCatedraticos = catedraticos.filter((catedratico) =>
    catedratico.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="course-list-page-container">
  <Sidebar />
  <Header />

  <div className="course-list-wrapper">
    <h2 className="course-list-heading">Lista de Cursos</h2>
    <ul className="course-list">
      {courses.map((course) => (
        <li key={course._id} className="course-item">
          <span>{course.title}</span>
          <button
            onClick={() =>
              userRole === "admin" ? handleAssignCatedratico(course._id) : null
            }
            className="course-item-btn"
          >
            {userRole === "admin" ? "Asignar Catedrático" : "Sin permiso"}
          </button>
        </li>
      ))}
    </ul>
  </div>

  {isModalOpen && (
    <div className="assign-instructor-modal">
      <div className="modal-content-container">
        <h3 className="modal-title">Selecciona un Catedrático</h3>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <ul className="instructor-list">
          {filteredCatedraticos.map((catedratico) => (
            <li
              key={catedratico._id}
              onClick={() => handleSelectCatedratico(catedratico._id)}
              className={selectedCatedratico === catedratico._id ? "instructor-selected" : ""}
            >
              {catedratico.name} - <strong>{catedratico.role}</strong>
            </li>
          ))}
        </ul>
        <div className="modal-actions">
          <button onClick={handleConfirmAssignment} className="modal-confirm-btn">Confirmar Asignación</button>
          <button onClick={() => setIsModalOpen(false)} className="modal-cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default AssignCatedratico;
