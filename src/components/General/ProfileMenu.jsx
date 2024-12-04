import React, { useContext } from "react";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

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
    <div style={styles.menu}>
      <button style={styles.menuItem} onClick={handleProfileClick}>
        Ver Perfil
      </button>
      <button style={styles.menuItem} onClick={handleLogoutClick}>
        Cerrar Sesión
      </button>
    </div>
  );
};

const styles = {
  menu: {
    position: "absolute",
    top: "2.25em",
    right: 0,
    backgroundColor: "#2c8c8c",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    padding: "10px 0",
    width: "150px",
  },
  menuItem: {
    display: "block",
    width: "100%",
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "16px",
    color: "#333",
    outline: "none",
  },
};

export default ProfileMenu;
