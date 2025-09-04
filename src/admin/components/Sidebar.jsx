import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiHome, FiFileText, FiBookOpen, FiLayers } from 'react-icons/fi'
import logo from "../../assets/DR-Logo.png";
const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <FiHome /> },
  { to: '/admin/banners', label: 'Banners', icon: <FiLayers /> },
  { to: '/admin/news', label: 'News', icon: <FiFileText /> },
  { to: '/admin/advertisements', label: 'Advertisements', icon: <FiFileText /> },
  { to: '/admin/business-settings', label: 'Business Settings', icon: <FiLayers /> },
  { to: '/admin/blogs', label: 'Blogs', icon: <FiFileText /> },
  { to: '/admin/research', label: 'Research', icon: <FiBookOpen /> },
  { to: '/admin/posts', label: 'Posts', icon: <FiLayers /> },
  { to: '/admin/epapers', label: 'E-Papers', icon: <FiFileText /> },
]

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleCollapse = () => setCollapsed(!collapsed)

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={onToggle} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
          <button onClick={handleCollapse} className="text-dark-green" aria-label="Toggle collapse">
            {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
          {!collapsed &&  <img src={logo} alt="logo" className="w-20" />}
          {/* Spacer to align */}
          <div className="w-5" />
        </div>

        {/* Nav */}
        <nav className="mt-4">
          {navItems.map(item => {
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-olive/60 transition-colors
                ${active ? 'bg-olive/80 text-dark-green' : 'text-green'}`}
              >
                <span className="text-dark-green">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
