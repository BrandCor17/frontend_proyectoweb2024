import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Sidebar from '../components/General/Sidebar';
import Header from '../components/General/Header';
import SearchBar from '../components/General/SearchBar';
import './styles/chat.css'; 

const URL = import.meta.env.VITE_BASE_URL;

const Chat = () => {
  const [contacts, setContacts] = useState([]);  
  const [messages, setMessages] = useState([]);  
  const [message, setMessage] = useState('');  
  const [selectedUser, setSelectedUser] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const socketRef = useRef(null); 

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${URL}/api/users/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }

      const data = await response.json();
      setContacts(data);  
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId, contactId) => {
    try {
      const response = await fetch(`${URL}/api/messages/${userId}/${contactId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,  
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los mensajes');
      }

      const data = await response.json();
      setMessages(data); 
    } catch (error) {
      console.error('Error al obtener los mensajes:', error);
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_BASE_URL; // Usar la variable de entorno para obtener la URL base
    socketRef.current = io(`${apiUrl}`);
  
    socketRef.current.on('connect', () => {
      console.log('Conectado a Socket.IO');
    });
  
    fetchUsers();
  
    return () => {
      socketRef.current.disconnect();
    };
  }, []);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim() && selectedUser) {
      const newMessage = {
        sender: 'Tú',
        recipient: selectedUser,
        message: message,
      };

      socketRef.current.emit('privateMessage', newMessage); 
      setMessages((prevMessages) => [...prevMessages, newMessage]);  
      setMessage('');
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user); 
    setMessages([]); 
    fetchMessages(user._id, 'userId'); 
  };

  const handleSearch = (term) => {
    setSearchTerm(term); 
  };

  useEffect(() => {
    if (selectedUser) {
      socketRef.current.on('privateMessage', (newMessage) => {
        if (
          (newMessage.sender === selectedUser._id && newMessage.recipient === 'userId') ||
          (newMessage.sender === 'userId' && newMessage.recipient === selectedUser._id)
        ) {
          setMessages((prevMessages) => [...prevMessages, newMessage]); 
        }
      });
    }
  }, [selectedUser]);

  return (
    <div className="chat-page">
  <Header />
  <Sidebar />

  <div className="chat-container">
    <div className="contact-list">
      <h3 className="contact-list-title">Contactos</h3>
      <SearchBar onSearch={handleSearch} className="search-bar" />
      {loading ? (
        <p className="loading-message">Cargando usuarios...</p>
      ) : filteredContacts.length === 0 ? (
        <p className="no-contacts-message">No se encontraron usuarios.</p>
      ) : (
        <ul className="contact-list-items">
          {filteredContacts.map((contact) => (
            <li
              key={contact._id}
              onClick={() => handleUserSelect(contact)}
              className={`contact-item ${selectedUser && selectedUser._id === contact._id ? 'active' : ''}`}
            >
              {contact.name}
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className="chat-box">
      {selectedUser ? (
        <>
          <h4 className="chat-box-title">Conversación con: {selectedUser.name}</h4>
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'Tú' ? 'sent' : 'received'}`}>
                <strong>{msg.sender}: </strong>{msg.message}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje"
              className="message-input"
            />
            <button type="submit" className="send-button">Enviar</button>
          </form>
        </>
      ) : (
        <p className="no-chat-message">Selecciona un contacto para empezar a chatear</p>
      )}
    </div>
  </div>
</div>

  );
};

export default Chat;
