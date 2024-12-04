import React, { useState, useEffect } from "react";
import Header from "../components/General/Header";
import "./styles/Home.css";
import Card from "../components/General/CourseCard";
import Sidebar from "../components/General/Sidebar";
import SearchBar from "../components/General/SearchBar";

const URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState([]);  
  const [userCourses, setUserCourses] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
        setUserCourses(data);  
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
    fetchUserCourses();
  }, []);

  const enrolledCourses = courses.filter(course =>
    userCourses.some(userCourse => userCourse._id === course._id)
  );

  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);  
  };

  return (
    <div className="principal-container">
  <Header toggleSidebar={toggleSidebar} />
  <Sidebar isOpen={isOpen} />

  <div className="search-container">
    <SearchBar onSearch={handleSearch} />
  </div>

  <div className="courses-container">
    {loading ? (
      <div>Loading...</div>
    ) : filteredCourses.length === 0 ? (
      <div className="no-courses-message">No estás inscrito en ningún curso o no se encontraron resultados</div>
    ) : (
      filteredCourses.map((course) => (
        <Card
          key={course._id}
          courseId={course._id}
          title={course.title}
          cycle="2024"
          instructor={course.instructor || "Instructor"}
          participants={course.students.length}
          userRole={localStorage.getItem("userRole")}
          isHomePage={true}
        />
      ))
    )}
  </div>
</div>

  );
};

export default Home;
