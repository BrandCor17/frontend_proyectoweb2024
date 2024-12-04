import React, { useState, useEffect } from "react";
import './Header.css';
import logo from '../../assets/mainLogo.png';
import ProfileMenu from './ProfileMenu';

function Header({ toggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(''); 

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BASE_URL; // Usando la variable de entorno
        const response = await fetch(`${apiUrl}/api/users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
  
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del perfil');
        }
  
        const data = await response.json();
        setProfileImage(data.photo);
      } catch (error) {
        console.error('Error al obtener la imagen de perfil:', error);
      }
    };
  
    fetchUserProfile();
  }, []);
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <button className="toggle-button" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <div className="header-left">
        <img src={logo} alt="Logo" className="header-logo" />
      </div>

      <div className="header-center">
        <h1>InstruConnect</h1>
      </div>

      <div className="header-right">
        <button className="login-link" onClick={toggleMenu}>
          {profileImage ? (
            <img src={profileImage} alt="Imagen de perfil" className="profile-image" />
          ) : (
            <i className="fas fa-user-circle"></i> 
          )}
        </button>

        {isMenuOpen && <ProfileMenu />}
      </div>
    </header>
  );
}

export default Header;
