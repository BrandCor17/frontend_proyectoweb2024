import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";
import './ProfileMenu.css'
const ProfileMenu = () => {
  const { handleLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    console.log("cerrar sesion presionado");
    handleLogout();
    navigate("/");
  };

  const handleProfileClick = () => {
    console.log(" Vista de perfil presionado")
    navigate("/profile")
  }

  return (
    <div className="menu">
  <button className="menu-item" onClick={handleProfileClick}>
    Ver Perfil
  </button>
  <button className="menu-item" onClick={handleLogoutClick}>
    Cerrar Sesión
  </button>
</div>

  );
};



export default ProfileMenu;
