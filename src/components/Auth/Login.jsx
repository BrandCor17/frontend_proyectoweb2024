import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import InputField from './inputField';
import usePost from '../../hooks/usePost';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../assets/mainLogo.png";
import "./styles/Login.css";

const URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const { handleSaveToken, handleSaveUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const { postData } = usePost(`${URL}/api/users/login`);
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    let formErrors = { email: '', password: '' };

    if (!formData.email) {
      formErrors.email = 'El correo electrónico es obligatorio';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Por favor, ingresa un correo electrónico válido';
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({ ...errors, [name]: '' }); 
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    try {
      const res = await postData(formData);
  
      if (res?.token && res?.user) {
        handleSaveToken(res.token);
        handleSaveUser(res.user);
  
        if (res.user.role) {
          localStorage.setItem("role", res.user.role); 
        }
  
        toast.success("¡Inicio de sesión exitoso!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
        });
        navigate('/home');
      } else {
        throw new Error("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Login error:", error);
  
      // Marcar los campos en rojo
      setErrors({
        email: "Verifica tu correo electrónico",
        password: "Verifica tu contraseña"
      });
  
      toast.error("Credenciales inválidas. Por favor, inténtalo de nuevo.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
      });
    }
  };
  

  const handleRegisterRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className='main-container'>
      <div className="login-container">
        <div className="login-right">
          <img src="https://uca.edu.sv/wp-content/themes/kubo/images/logo-uca.png" alt="UCA Logo" />
          <h2>Iniciar sesión</h2>

          <form onSubmit={handleSubmitLogin}>
            <InputField
              label="Email:"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
              required
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}

            <InputField
              label="Password:"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              required
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}

            <button type="submit" className='button'>Login</button>
          </form>
        </div>

        <div className="login-left">
          <img src={logo} alt="InstructConnect Logo" />
          <h1>Bienvenidos a</h1>
          <h2>InstructConnect</h2>
          <button onClick={handleRegisterRedirect}>
            Registrarse
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
