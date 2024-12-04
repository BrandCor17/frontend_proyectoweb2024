import React, { useState, useEffect } from "react";
import Header from "../components/General/Header";
import "./styles/Home.css";
import Card from "../components/General/CourseCard";
import Sidebar from "../components/General/Sidebar";
import SearchBar from "../components/General/SearchBar";
import AddButton from "../components/General/AddButton"; 

const URL = import.meta.env.VITE_BASE_URL;

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (searchTerm) => {
    console.log("Buscando cursos con:", searchTerm);
    if (!searchTerm) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await fetch(`${URL}/api/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la respuesta del servidor:", errorData);
        throw new Error("Error obteniendo el rol del usuario");
      }

      const data = await response.json();
      console.log("Rol del usuario:", data.role);
      setUserRole(data.role);
    } catch (err) {
      console.error("Error al obtener el rol del usuario:", err);
    }
  };

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
        console.log("Cursos recibidos:", data);
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
    fetchUserRole();
  }, []);

  const handleDeleteCourse = (deletedCourseId) => {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course._id !== deletedCourseId)
    );
    setFilteredCourses((prevFilteredCourses) =>
      prevFilteredCourses.filter((course) => course._id !== deletedCourseId)
    );
  };

  return (
    <div className="principal-container">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isOpen} />
      
      <div className="search-container">
        <SearchBar onSearch={handleSearch} />
      </div>

      {userRole === "admin" && <AddButton />}

      <div className="courses-container">
        {loading ? (
          <div>Loading...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="no-courses-message">No hay cursos disponibles</div>
        ) : (
          filteredCourses.map((course) => (
            <Card
              key={course._id}
              courseId={course._id}
              title={course.title}
              cycle="2024"
              instructor={course.instructor ? course.instructor.name : "Instructor no asignado"}
              participants={course.students.length}
              userRole={userRole}
              onDelete={handleDeleteCourse}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Search;
