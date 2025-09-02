import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserAuthProvider } from "./contexts/UserAuthContext.jsx";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserAuthProvider>
          <App />
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />
        </UserAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
