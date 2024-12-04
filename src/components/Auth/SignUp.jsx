import React, { useState } from 'react';
import logo from "../../assets/mainLogo.png";
import "./styles/SignUp.css";
import InputField from './inputField';
import { useNavigate } from 'react-router-dom';
import usePost from '../../hooks/usePost';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const URL = import.meta.env.VITE_BASE_URL;

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        imageLink: '', 
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        imageLink: '',
        role: 'student', 
    });

    const navigate = useNavigate();
    const { postData, loading } = usePost(`${URL}/api/users/register`);

    // Validaciones de formulario
    const validateForm = () => {
        let isValid = true;
        let formErrors = { name: '', email: '', password: '', confirmPassword: '', imageLink: '' };

        // Validación del nombre 
        if (!formData.name) {
            formErrors.name = 'El nombre es obligatorio';
            isValid = false;
        } else if (/^\d+$/.test(formData.name)) {
            formErrors.name = 'El nombre no puede ser un número';
            isValid = false;
        }

        // Validación del correo electrónico
        if (!formData.email) {
            formErrors.email = 'El correo electrónico es obligatorio';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Por favor, ingresa un correo electrónico válido';
            isValid = false;
        }

        // Validación de la contraseña (mínimo 8 caracteres)
        if (!formData.password) {
            formErrors.password = 'La contraseña es obligatoria';
            isValid = false;
        } else if (formData.password.length < 8) {
            formErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            isValid = false;
        }

        // Validación de confirmación de contraseña
        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        // Validación del enlace de la imagen (opcional)
        if (formData.imageLink && !/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/.test(formData.imageLink)) {
            formErrors.imageLink = 'Por favor, ingresa un enlace de imagen válido (jpg, jpeg, png, gif)';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmitRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return; 
        }

        try {
            const res = await postData(formData);

            if (res?.message) {
                toast.success(res.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                });
                navigate('/verify-email', { state: { email: formData.email } });
            } else {
                toast.error("Error: No se recibió una respuesta válida del servidor", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                });
            }
        } catch (err) {
            console.error("Error al registrar el usuario:", err);
            toast.error(`Error: ${err?.message || "No se pudo completar el registro"}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
            });
        }
    };

    // Redirigir al login
    const handleLoginRedirect = () => {
        navigate('/');
    };

    return (
        <div className="signup-main-container">
            <div className="signup-container">
                <div className="signup-left">
                    <img src={logo} alt="InstructConnect Logo" />
                    <h1>Bienvenidos a</h1>
                    <h2>InstructConnect</h2>
                    <button onClick={handleLoginRedirect}>Iniciar sesión</button>
                </div>

                <div className="signup-right">
                    <h2>Crear cuenta</h2>
                    <form onSubmit={handleSubmitRegister}>
                        <InputField
                            label="Name:"
                            name="name"
                            type="text"
                            placeholder="Nombre completo"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}

                        <InputField
                            label="Email:"
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}

                        <InputField
                            label="Password:"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}

                        <InputField
                            label="Confirm Password:"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className={errors.confirmPassword ? 'input-error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}

                        <InputField
                            label="Profile Image Link (Optional):"
                            name="imageLink"
                            type="text"
                            placeholder="Enlace a la imagen"
                            value={formData.imageLink}
                            onChange={handleChange}
                            className={errors.imageLink ? 'input-error' : ''}
                        />
                        {errors.imageLink && <span className="error-message">{errors.imageLink}</span>}

                        <button type="submit" disabled={loading}>
                            {loading ? 'Cargando...' : 'Registrarse'}
                        </button>
                    </form>
                </div>
            </div>

            <ToastContainer /> {/* Contenedor de notificaciones */}
        </div>
    );
};

export default SignUp;
