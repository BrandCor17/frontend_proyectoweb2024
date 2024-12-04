import React, { useEffect, useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import axios from "axios";
import SearchBar from "../components/General/SearchBar";
import "./styles/AssignPage.css";

const AssignCatedratico = () => {
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catedraticos, setCatedraticos] = useState([]); // Lista de catedráticos
  const [selectedCatedratico, setSelectedCatedratico] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Obtener los cursos y el rol del usuario actual
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/courses/courses");
        setCourses(response.data);

        const currentUser = JSON.parse(localStorage.getItem("user"));
        setUserRole(currentUser?.role);
      } catch (error) {
        console.error("Error al obtener los cursos", error);
      }
    };

    fetchData();
  }, []);

  // Función para obtener solo los catedráticos
  const fetchCatedraticos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/users", {
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
    const apiUrl = import.meta.env.VITE_BASE_URL; 
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
    <div className="principal-container">
      <Sidebar />
      <Header />
      <div className="course-list-container">
        <h2>Lista de Cursos</h2>
        <ul>
          {courses.map((course) => (
            <li key={course._id} className="course-item">
              <span>{course.title}</span>
              <button
                onClick={() =>
                  userRole === "admin" ? handleAssignCatedratico(course._id) : null
                }
              >
                {userRole === "admin" ? "Asignar Catedrático" : "Sin permiso"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Selecciona un Catedrático</h3>
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
              {filteredCatedraticos.map((catedratico) => (
                <li
                  key={catedratico._id}
                  onClick={() => handleSelectCatedratico(catedratico._id)}
                  className={selectedCatedratico === catedratico._id ? "selected" : ""}
                >
                  {catedratico.name} - <strong>{catedratico.role}</strong>
                </li>
              ))}
            </ul>
            <button onClick={handleConfirmAssignment}>Confirmar Asignación</button>
            <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignCatedratico;
