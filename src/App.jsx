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
import TrendingNews from "./admin/pages/TrendingNews.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import Blogs from "./pages/Blogs.jsx";
import ResearchPublic from "./pages/Research.jsx";
import ResearchDetail from "./pages/ResearchDetail.jsx";
import ResearchCreate from "./pages/ResearchCreate.jsx";
import Schemes from "./pages/Schemes.jsx";
import EPapersPublic from "./pages/EPapers.jsx";
import Research from "./admin/pages/Research.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/research" element={<ResearchPublic />} />
          <Route path="/research/:id" element={<ResearchDetail />} />
          <Route
            path="/research/create"
            element={
              <UserPrivateRoute>
                <ResearchCreate />
              </UserPrivateRoute>
            }
          />
          <Route
            path="/epapers"
            element={
              // <UserPrivateRoute>
                <EPapersPublic />
              //  </UserPrivateRoute>
            }
          />
          
        </Route>

        {/* Standalone Profile outside MainLayout */}
        <Route
          path="/profile"
          element={
            <UserPrivateRoute>
              <Profile />
            </UserPrivateRoute>
          }
        />

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
          <Route path="research" element={<Research />} />
          <Route path="trending-news" element={<TrendingNews />} />
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
