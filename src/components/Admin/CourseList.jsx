import React, { useState } from "react";
import axios from "axios";
import SearchBar from "../General/SearchBar"; 
import "../../pages/styles/AssignPage.css";
//hola
const CourseList = ({ courses, userRole }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInstructors = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;  // Usando la variable de entorno
      const response = await axios.get(`${apiUrl}/api/users/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const instructorsList = response.data.filter((user) => user.role === "instructor");
      setInstructors(instructorsList);
    } catch (error) {
      console.error("Error al obtener los instructores:", error);
    }
  };

  const handleAssignInstructor = async (courseId) => {
    await fetchInstructors();
    setIsModalOpen(true);
  };

  const handleSelectInstructor = (instructorId) => {
    setSelectedInstructor(instructorId);
  };

  const handleConfirmAssignment = async () => {
    if (selectedInstructor) {
      try {
        // Lógica para asignar el instructor al curso
        console.log("Instructor asignado:", selectedInstructor);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error al asignar instructor", error);
      }
    }
  };

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="course-list-container">
      <h2>Lista de Cursos</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id} className="course-item">
            <span>{course.title}</span>
            <button
              onClick={() => userRole === "catedratico" && handleAssignInstructor(course._id)}
            >
              {userRole === "catedratico" ? "Asignar Instructor" : "Sin permiso"}
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Selecciona un Instructor</h3>
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <ul>
              {filteredInstructors.map((instructor) => (
                <li
                  key={instructor._id}
                  onClick={() => handleSelectInstructor(instructor._id)}
                  className={selectedInstructor === instructor._id ? "selected" : ""}
                >
                  {instructor.name} - <strong>{instructor.role}</strong>
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

export default CourseList;
