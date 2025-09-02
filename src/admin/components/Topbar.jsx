import React from "react";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext.jsx";

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 bg-olive border-b border-gray-200 flex items-center justify-between md:justify-end px-4">
      <button
        onClick={onMenuClick}
        className="text-dark-green md:hidden"
        aria-label="Open sidebar"
      >
        <FiMenu size={22} />
      </button>
     
      <div className="flex items-center gap-3 ">
        {user?.email && (
          <span className="text-sm text-green hidden sm:block">
            {user.email}
          </span>
        )}
        <button
          onClick={logout}
          className="text-olive bg-dark-green hover:bg-green px-3 py-1.5 rounded-md text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
