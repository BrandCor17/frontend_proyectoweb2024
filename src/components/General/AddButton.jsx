import React, { useState } from "react";
import "./AddEvent.css";
import EventForm from "../Tutor/EventForm"; 
import CrearCurso from "../Admin/CreateCourse";

const AddButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); 
  const userRole = localStorage.getItem("role");

  const handleButtonClick = () => {
    setIsFormOpen(true); 
  };

  const handleCloseForm = () => {
    setIsFormOpen(false); 
  };

  if (!userRole || (userRole !== "admin" && userRole !== "instructor")) {
    return null; 
  }

  return (
    <div>
      <button className="instructor-button" onClick={handleButtonClick}>
        +
      </button>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseForm}>
              X
            </button>

            {userRole === "admin" ? (
              <CrearCurso onClose={handleCloseForm} />
            ) : (
              <EventForm onClose={handleCloseForm} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddButton;
