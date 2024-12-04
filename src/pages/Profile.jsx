import React, { useState, useEffect } from "react";
import Sidebar from "../components/General/Sidebar";
import Header from "../components/General/Header";
import RequestInstructorRole from "../components/General/FormRequest";
import "./styles/Profile.css";

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null); 
  const [userCourses, setUserCourses] = useState([]); 
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [userRole, setUserRole] = useState(""); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data);
        setUserRole(data.role); 
      } catch (err) {
        console.error("Error fetching user data:", err);
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
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const courses = await response.json();
        setUserCourses(courses); 
      } catch (err) {
        console.error("Error fetching user courses:", err);
      }
    };

    fetchUserData();
    fetchUserCourses();
  }, []);

  const handleRequestInstructorRole = () => {
    setShowRequestForm(true);
  };

  const handleLeaveCourse = async (courseId) => {
    try {
      const response = await fetch(`${URL}/api/courses/remove-user/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar al usuario del curso.");
      }

      setUserCourses((prevCourses) => prevCourses.filter(course => course._id !== courseId));

      alert("Has salido del curso exitosamente.");
    } catch (err) {
      console.error("Error al salir del curso:", err);
      alert("Hubo un error al intentar salir del curso.");
    }
  };

  if (!userData) {
    return <div>Cargando...</div>; 
  }

  return (
    <div className="unique-principal-container">
      <Header />
      <Sidebar />
      <div className="unique-content-container">
        {/* Contenedor de información del perfil */}
        <div className="unique-profile-container">
          <div className="unique-profile-text">
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
          </div>
          <div className="unique-profile-image">
            <img
              src={userData.profileImageUrl || "https://via.placeholder.com/80"}
              alt="Perfil"
            />
          </div>
          {userRole === "student" && (
            <button
              className="unique-btn-instructor"
              onClick={handleRequestInstructorRole}
            >
              Solicitar permisos de instructor
            </button>
          )}
        </div>

        {/* Contenedor de los cursos del usuario */}
        <div className="unique-user-courses-container">
          <h3>Mis Cursos</h3>
          {userCourses.length > 0 ? (
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {userCourses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>{course.description}</td>
                    <td>
                      <button
                        onClick={() => handleLeaveCourse(course._id)}
                        className="leave-course-btn"
                      >
                        Salir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No estás inscrito en ningún curso.</p>
          )}
        </div>

        {showRequestForm && <RequestInstructorRole />}
      </div>
    </div>
  );
};

export default Profile;
