import React, { useEffect, useState } from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import axios from "axios";
import SearchBar from "../components/General/SearchBar";
import "./styles/AssignInstructorPage.css";

const AssignInstructor = () => {
  const [courses, setCourses] = useState([]);
  const [userRole, setUserRole] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [instructors, setInstructors] = useState([]); 
  const [selectedInstructor, setSelectedInstructor] = useState(null); 
  const [selectedCourse, setSelectedCourse] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BASE_URL; 
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
  

  const fetchInstructors = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL; 
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
    console.log("Abriendo modal para el curso:", courseId);
    setSelectedCourse(courseId);
    await fetchInstructors(); 
    setIsModalOpen(true);
  };

  const handleSelectInstructor = (instructorId) => {
    setSelectedInstructor(instructorId); 
  };

  const handleConfirmAssignment = async () => {
    if (selectedInstructor && selectedCourse) {
      try {
        const apiUrl = import.meta.env.VITE_BASE_URL; // Usando la variable de entorno
        const response = await axios.patch(
          `${apiUrl}/api/courses/assign-instructor/${selectedInstructor}`,
          { courseId: selectedCourse },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        console.log("Instructor asignado:", response.data);
  
        setIsModalOpen(false);
  
      } catch (error) {
        console.error("Error al asignar instructor", error);
  
        if (error.response && error.response.status === 400) {
          alert("Este instructor ya está asignado a este curso.");
        } else {
          alert("Hubo un error al asignar el instructor. Intenta nuevamente.");
        }
      }
    }
  };
  

  const filteredInstructors = instructors.filter((instructor) =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                  userRole === "catedratico" ? handleAssignInstructor(course._id) : null
                }
                className="course-item-btn"
              >
                {userRole === "catedratico" ? "Asignar Instructor" : "Sin permiso"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="assign-instructor-modal">
          <div className="modal-content-container">
            <h3 className="modal-title">Selecciona un Instructor</h3>
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="search-input"
            />
            <ul className="instructor-list">
              {filteredInstructors.map((instructor) => (
                <li
                  key={instructor._id}
                  onClick={() => handleSelectInstructor(instructor._id)}
                  className={selectedInstructor === instructor._id ? "instructor-selected" : ""}
                >
                  {instructor.name} - <strong>{instructor.role}</strong>
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

export default AssignInstructor;
