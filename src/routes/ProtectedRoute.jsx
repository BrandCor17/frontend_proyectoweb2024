const ProtectedRoute = ({ element: Component }) => {
    const token = localStorage.getItem("token");
    return token ? <Component /> : <Navigate to="/" />;
  };
  export default ProtectedRoute;