import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiX, FiHome, FiFileText, FiBookOpen, FiLayers } from 'react-icons/fi'
import logo from "../../assets/DR-Logo.png";
const navItems = [
  { type: 'link', to: '/admin', label: 'Dashboard', icon: <FiHome /> },
  { type: 'link', to: '/admin/banners', label: 'Banners', icon: <FiLayers /> },
  {
    type: 'group',
    label: 'News',
    icon: <FiFileText />,
    children: [
      { to: '/admin/news', label: 'Agriculture News' },
      { to: '/admin/trending-news', label: 'Trending News' },
    ]
  },
  { type: 'link', to: '/admin/research', label: 'Research', icon: <FiBookOpen /> },
  { type: 'link', to: '/admin/advertisements', label: 'Advertisements', icon: <FiFileText /> },
  { type: 'link', to: '/admin/business-settings', label: 'Business Settings', icon: <FiLayers /> },
  { type: 'link', to: '/admin/blogs', label: 'Blogs', icon: <FiFileText /> },
  { type: 'link', to: '/admin/posts', label: 'Posts', icon: <FiLayers /> },
  { type: 'link', to: '/admin/epapers', label: 'E-Papers', icon: <FiFileText /> },
]

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [openGroups, setOpenGroups] = useState({})

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
          {navItems.map((item, idx) => {
            if (item.type === 'group') {
              const isOpen = !!openGroups[item.label]
              const isActive = item.children?.some(c => location.pathname === c.to)
              return (
                <div key={`group-${item.label}-${idx}`}>
                  <button
                    type="button"
                    onClick={() => setOpenGroups(v => ({ ...v, [item.label]: !isOpen }))}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-olive/60 transition-colors ${isActive ? 'bg-olive/80 text-dark-green' : 'text-green'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-dark-green">{item.icon}</span>
                      {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </span>
                    {!collapsed && <span className={`transition-transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}>▸</span>}
                  </button>
                  {!collapsed && isOpen && (
                    <div className="pl-10 pr-4 py-1">
                      {item.children.map(child => {
                        const activeChild = location.pathname === child.to
                        return (
                          <Link
                            key={child.to}
                            to={child.to}
                            className={`block py-2 text-sm hover:text-dark-green ${activeChild ? 'text-dark-green font-medium' : 'text-green'}`}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-olive/60 transition-colors ${active ? 'bg-olive/80 text-dark-green' : 'text-green'}`}
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
