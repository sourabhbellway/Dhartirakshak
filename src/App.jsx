import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login";
import { useAuth } from "./contexts/AuthContext.jsx";
import AdminLayout from "./admin/layout/AdminLayout.jsx";
import Dashboard from "./admin/pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import { useUserAuth } from "./contexts/UserAuthContext.jsx";
import Banners from "./admin/pages/Banners.jsx";
import News from "./admin/pages/News.jsx";
import Advertisements from "./admin/pages/Advertisements.jsx";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin-login" replace />;
};

const UserPrivateRoute = ({ children }) => {
  const { isAuthenticated } = useUserAuth();
  return isAuthenticated ? children : (
    <Navigate to="/" replace state={{ openAuth: true, tab: 'signin' }} />
  );
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin */}
        <Route path="/admin-login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="banners" element={<Banners />} />
          <Route path="news" element={<News />} />
          <Route path="advertisements" element={<Advertisements />} />
        </Route>

        {/* User Auth via Modal (routes removed) */}
        <Route
          path="/profile"
          element={
            <UserPrivateRoute>
              <Profile />
            </UserPrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
