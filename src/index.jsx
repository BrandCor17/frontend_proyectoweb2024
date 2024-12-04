import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App"
import { AuthProvider } from "./contexts/authContext";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
<App/>
</AuthProvider>
  </StrictMode>
)