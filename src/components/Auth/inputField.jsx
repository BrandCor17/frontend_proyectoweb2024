import React from "react";

const InputField = ({
  name,
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  as = "input",
  placeholder = '',
  className = '', // Recibimos la clase dinámica
}) => {
  const Component = as === "textarea" ? "textarea" : "input";

  return (
    <div className="input-field-container">
      <label htmlFor={id}>
        {label}
      </label>
      <Component
        id={id}
        value={value}
        type={type}
        onChange={onChange}
        required={required}
        name={name}
        className={className}
        rows={as === "textarea" ? 4 : undefined}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
