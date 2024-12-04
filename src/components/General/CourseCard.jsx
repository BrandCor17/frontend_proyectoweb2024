import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./Card.css";
import sampleImage from "../../assets/logoIC.svg";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseCard = ({ courseId, title, cycle, instructor, participants, userRole, onDelete, isHomePage }) => {
  const navigate = useNavigate(); 

  const handleEnroll = async (event) => {
    event.stopPropagation(); 

    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;  // Usando la variable de entorno
      const response = await fetch(`${apiUrl}/api/courses/enroll/${courseId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.alert("Te has inscrito al curso.");
      } else {
        window.alert(data.message || "Ya estás inscrito en este curso.");
      }
    } catch (error) {
      console.error("Error inscribiendo al curso:", error);
      window.alert("Hubo un error al intentar inscribirse al curso. Intenta nuevamente.");
    }
  };

  const handleCardClick = () => {
    navigate(`/courseview/${courseId}`);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    
    console.log(courseId); 
  
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;  // Usando la variable de entorno
      const response = await fetch(`${apiUrl}/api/courses/delete/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Curso eliminado con éxito.");
        onDelete(courseId);
      } else {
        toast.error(data.message || "Hubo un error al intentar eliminar el curso.");
      }
    } catch (error) {
      console.error("Error eliminando el curso:", error);
      toast.error("Hubo un error al intentar eliminar el curso. Intenta nuevamente.");
    }
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <img src={sampleImage} alt="Card background" className="card-image" />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-cycle">{cycle}</p>
        <p className="card-instructor">{instructor}</p>
        <p className="card-participants">{participants} participantes</p>

        {!isHomePage && userRole !== "admin" && userRole !== "catedratico" && (
          <button onClick={handleEnroll} className="card-enroll-btn">
            Inscribirse
          </button>
        )}

        {userRole === "admin" && (
          <button onClick={handleDelete} className="card-delete-btn">
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
