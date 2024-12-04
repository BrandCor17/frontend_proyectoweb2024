import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      console.log("Ejecutando búsqueda con término:", searchTerm);
      onSearch(searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress} 
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ccc",
    borderRadius: "25px",
    overflow: "hidden",
    width: "100%",
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "1em",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    padding: "1em",
    cursor: "pointer",
    fontSize: "16px",
    borderRadius: "0 25px 25px 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default SearchBar;
