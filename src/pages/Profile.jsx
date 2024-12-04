import React, { useState, useEffect } from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import Card from "../components/General/CourseCard";
import RequestInstructorRole from "../components/General/FormRequest";
import "./styles/Profile.css"
const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);  
  const [userCourses, setUserCourses] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");  
  const [showRequestForm, setShowRequestForm] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Fetch de cursos generales y los cursos del usuario
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${URL}/api/courses/courses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching courses");
        }

        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserCourses = async () => {
      try {
        const response = await fetch(`${URL}/api/courses/user-courses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching user courses");
        }

        const data = await response.json();
        setUserCourses(data);  // Guarda los cursos en los que el usuario está inscrito
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
    fetchUserCourses();
  }, []);

  // Filtrar los cursos en los que el usuario está inscrito
  const enrolledCourses = courses.filter(course =>
    userCourses.some(userCourse => userCourse._id === course._id)
  );

  // Filtrar los cursos por nombre, usando el término de búsqueda
  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función de búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term);  // Actualiza el término de búsqueda
  };

  // Función para mostrar el formulario de solicitud de instructor
  const handleRequestInstructorRole = () => {
    setShowRequestForm(true); // Muestra el formulario
  };

  return (
    <div className="unique-principal-container">
  <Header />
  <Sidebar />
  <div className="unique-content-container">
    {/* Contenedor de información del perfil */}
    <div className="unique-profile-container">
      <div className="unique-profile-text">
        <h2>Brandon Josué Cornejo Sánchez</h2>
        <p>00092322</p>
      </div>
      <div className="unique-profile-image">
        <img
          src="https://via.placeholder.com/80" // Reemplaza con la imagen deseada
          alt="Perfil"
        />
      </div>
      <button
        className="unique-btn-instructor"
        onClick={handleRequestInstructorRole}
      >
        Solicitar permisos de instructor
      </button>
    </div>

    {/* Si el formulario de solicitud se muestra, renderiza el componente RequestInstructorRole */}
    {showRequestForm && <RequestInstructorRole />}

    {/* Contenedor de tarjetas de grupos */}
    <div className="unique-courses-container">
      {loading ? (
        <div>Loading...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="unique-no-courses-message">No estás inscrito en ningún curso o no se encontraron resultados</div>
      ) : (
        filteredCourses.map((course) => (
          <Card
            key={course._id}
            title={course.title}
            cycle="2024"
            instructor={course.instructors[0]?.name || "Instructor"}
            participants={course.students.length}
            isHomePage={true}
          />
        ))
      )}
    </div>
  </div>
</div>

  );
};

export default Profile;
