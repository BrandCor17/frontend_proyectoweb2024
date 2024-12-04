import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Home from './pages/HomePage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthContext } from './contexts/authContext';
import VerifyEmail from './components/Auth/VerifyEmail';
import Search from './pages/SearchPage';
import Requests from './pages/Requests';
import "react-toastify/dist/ReactToastify.css";
import Calendar from './pages/Calendar';
import CoursesAsStudent from './pages/InstructorCourses';
import Profile from './pages/Profile';
import UserList from './pages/UserList';
import AssignInstructor from './pages/AssignInstructorPage';
import AssignCatedratico from './pages/AssignCatedraticoPage';
import Chat from './pages/Chat';
import CourseDetails from './pages/CourseDetails';
const App = () => {
  const { token } = useContext(AuthContext);

  console.log("Token en App.jsx:", token); 

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/search" element={<ProtectedRoute element={Search} />} />
        <Route path="/courseview/:courseId" element={<ProtectedRoute element={CourseDetails} />} />
        <Route path="/calendar" element={<ProtectedRoute element={Calendar} />} />
        <Route path="/requests" element={<ProtectedRoute element={Requests} />} />
        <Route path="/coursesAsStudent" element={<ProtectedRoute element={CoursesAsStudent} />} />
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route path="/assign-instructor" element={<ProtectedRoute element={AssignInstructor} />} />
        <Route path="/user-list" element={<ProtectedRoute element={UserList} />} />
        <Route path="/chat" element={<ProtectedRoute element={Chat} />} />
        <Route path="/assign-catedratico" element={<ProtectedRoute element={AssignCatedratico} />} />

      </Routes>
    </Router>
  );
};

export default App;
