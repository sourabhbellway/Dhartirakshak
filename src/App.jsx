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
import BusinessSettings from "./admin/pages/BusinessSettings.jsx";
import EPapers from "./admin/pages/EPapers.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import Blogs from "./pages/Blogs.jsx";
import Schemes from "./pages/Schemes.jsx";
import EPapersPublic from "./pages/EPapers.jsx";

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
        {/* Public site wrapped in MainLayout */}
        <Route element={<MainLayout /> }>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route
            path="/epapers"
            element={
              <UserPrivateRoute>
                <EPapersPublic />
              </UserPrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserPrivateRoute>
                <Profile />
              </UserPrivateRoute>
            }
          />
        </Route>

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
          <Route path="business-settings" element={<BusinessSettings />} />
          <Route path="epapers" element={<EPapers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
