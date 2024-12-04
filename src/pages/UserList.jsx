import React, { useState, useEffect } from "react";
import Header from "../components/General/Header";
import "./styles/UserList.css";
import Sidebar from "../components/General/Sidebar";
import SearchBar from "../components/General/SearchBar";

const URL = import.meta.env.VITE_BASE_URL;

const UserList = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [users, setUsers] = useState([]);  
    const [loading, setLoading] = useState(true);  
    const [searchTerm, setSearchTerm] = useState("");  
    const [showModal, setShowModal] = useState(false);  
    const [showRoleModal, setShowRoleModal] = useState(false);  
    const [userToDelete, setUserToDelete] = useState(null); 
    const [userToChangeRole, setUserToChangeRole] = useState(null); 
    const [newRole, setNewRole] = useState(""); 

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleSearch = (term) => {
        setSearchTerm(term);  
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${URL}/api/users/users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,  
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los usuarios");
            }

            const data = await response.json();
            setUsers(data);  
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${URL}/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el usuario");
            }

            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
            setShowModal(false); 
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
        }
    };

    const handleChangeRole = async () => {
        if (!newRole) return;  

        try {
            const response = await fetch(`${URL}/api/users/${userToChangeRole}/role`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) {
                throw new Error("Error al cambiar el rol");
            }

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user._id === userToChangeRole ? { ...user, role: newRole } : user
                )
            );
            setShowRoleModal(false); 
        } catch (error) {
            console.error("Error al cambiar el rol:", error);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="unique-principal-container">
  <Header toggleSidebar={toggleSidebar} />
  <Sidebar isOpen={isOpen} />

  <div className="unique-list-container">
    <div className="unique-list-header">
      <h2>Lista de usuarios</h2>
    </div>
    <SearchBar onSearch={handleSearch} />
    <div className="unique-user-list">
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : filteredUsers.length === 0 ? (
        <p>No se encontraron usuarios.</p>
      ) : (
        <table className="unique-user-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "admin" && (
                    <>
                      <button
                        className="unique-delete-btn"
                        onClick={() => {
                          setUserToDelete(user._id);
                          setShowModal(true);
                        }}
                      >
                        Eliminar
                      </button>
                      <button
                        className="unique-change-role-btn"
                        onClick={() => {
                          setUserToChangeRole(user._id);
                          setShowRoleModal(true);
                        }}
                      >
                        Cambiar Rol
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>

  {showModal && (
    <div className="unique-modal-overlay">
      <div className="unique-modal">
        <h3>¿Estás seguro de que deseas eliminar este usuario?</h3>
        <div className="unique-modal-buttons">
          <button
            className="unique-cancel-btn"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button
            className="unique-confirm-btn"
            onClick={() => handleDelete(userToDelete)}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )}

  {showRoleModal && (
    <div className="unique-modal-overlay">
      <div className="unique-modal">
        <h3>Selecciona el nuevo rol</h3>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="">Seleccionar rol</option>
          <option value="student">Estudiante</option>
          <option value="instructor">Instructor</option>
          <option value="catedratico">Catedrático</option>
        </select>
        <div className="unique-modal-buttons">
          <button
            className="unique-cancel-btn"
            onClick={() => setShowRoleModal(false)}
          >
            Cancelar
          </button>
          <button
            className="unique-confirm-btn"
            onClick={handleChangeRole}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    );
};

export default UserList;
