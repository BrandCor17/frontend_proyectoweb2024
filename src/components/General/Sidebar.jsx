import React, { useContext } from "react";
import './Sidebar.css';
import { AuthContext } from "../../contexts/authContext";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isOpen }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isHomeActive = location.pathname === "/home";
  const isSearchActive = location.pathname === "/search";
  const isCalendarActive = location.pathname === "/calendar";
  const isFilesActive = location.pathname === "/coursesAsStudent";
  const isUserListActive = location.pathname === "/User-list";
  const isAssignInstructorActive = location.pathname === "/assign-instructor";
  const isAssignCatedraticoActive = location.pathname === "/assign-catedratico";
  const isRequestsActive = location.pathname === "/Requests";

  const isChatActive = location.pathname === "/chat";

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        <ul className="menu">
          {(user?.role === "student" || user?.role === "instructor" || user?.role === "catedratico") && (
            <li
              className={`menu-item ${isHomeActive ? "active" : ""}`}
              onClick={() => handleNavigation('/home')}
            >
              <i className="fas fa-home"></i>
              {isOpen && <span>Home</span>}
            </li>
          )}

          {user?.role === "instructor" && (
            <li className={`menu-item ${isFilesActive ? "active" : ""}`} onClick={() => handleNavigation('/coursesAsStudent')}>
              <i className="fas fa-folder"></i>
              {isOpen && <span>Files</span>}
            </li>
          )}

          {(user?.role === "student" || user?.role === "instructor" || user?.role === "catedratico") && (
            <li className={`menu-item ${isChatActive ? "active" : ""}`} onClick={() => handleNavigation('/chat')}>
              <i className="fas fa-comments"></i>
              {isOpen && <span>Messages</span>}
            </li>
          )}

          <li className={`menu-item ${isSearchActive ? "active" : ""}`} onClick={() => handleNavigation('/search')}>
            <i className="fas fa-search"></i>
            {isOpen && <span>Search</span>}
          </li>

          {(user?.role === "student" || user?.role === "instructor") && (
            <li className={`menu-item ${isCalendarActive ? "active" : ""}`} onClick={() => handleNavigation('/calendar')}>
              <i className="fas fa-calendar"></i>
              {isOpen && <span>Calendar</span>}
            </li>
          )}

          {(user?.role === "catedratico") && (
            <li className={`menu-item ${isAssignInstructorActive ? "active" : ""}`} onClick={() => handleNavigation('/assign-instructor')}>
              <i className="fas fa-user-plus"></i>
              {isOpen && <span>Assign</span>}
            </li>
          )}

          {(user?.role === "admin") && (
            <li className={`menu-item ${isAssignCatedraticoActive ? "active" : ""}`} onClick={() => handleNavigation('/assign-catedratico')}>
              <i className="fas fa-user-plus"></i>
              {isOpen && <span>Assignaciones</span>}
            </li>
          )}

          {user?.role === "catedratico" && (
            <li className={`menu-item ${isRequestsActive ? "active" : ""}`} onClick={() => handleNavigation('/Requests')}>
              <i className="fas fa-users"></i>
              {isOpen && <span>Solicitudes</span>}
            </li>
          )}

          {user?.role === "admin" && (
            <li className={`menu-item ${isUserListActive ? "active" : ""}`} onClick={() => handleNavigation('/User-list')}>
              <i className="fas fa-trash"></i>
              {isOpen && <span>Usuarios</span>}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
