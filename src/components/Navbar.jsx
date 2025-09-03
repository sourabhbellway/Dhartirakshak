import React, { useState, useEffect } from 'react'
import logo from "../assets/DR-Logo.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RiCloseLargeLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { IoArrowForward } from "react-icons/io5";
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom'
import AuthModal from './AuthModal.jsx'
import { useUserAuth } from '../contexts/UserAuthContext.jsx'
import { toast } from 'react-toastify'
import categoryPublicController from '../controllers/categoryPublicController.js'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [authToken, setAuthToken] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [defaultTab, setDefaultTab] = useState('signin')
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useUserAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileMenuRef = React.useRef(null)
  const [categories, setCategories] = useState([])
  const [catError, setCatError] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('user_token') : null
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    setAuthToken(token)

    const handleStorage = () => {
      const updatedUserToken = localStorage.getItem('user_token')
      const updatedAdminToken = localStorage.getItem('admin_token')
      setAuthToken(updatedUserToken)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // Handle scroll event to make navbar fixed
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Make navbar fixed when scrolling down
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open modal if redirected with state from protected route
  useEffect(() => {
    const state = location.state
    if (state && state.openAuth) {
      setDefaultTab(state.tab === 'signup' ? 'signup' : 'signin')
      setShowAuth(true)
      // Clear state so back/forward doesn't keep reopening
      navigate(location.pathname, { replace: true })
    }
  }, [location, navigate])

  // Load categories for navigation links
  useEffect(() => {
    const load = async () => {
      try {
        const res = await categoryPublicController.list()
        const data = res?.data || res || []
        setCategories(Array.isArray(data) ? data : [])
      } catch (e) {
        setCatError('')
      }
    }
    load()
  }, [])

  const getCategoryName = (c) => c?.category || c?.name || c?.title || ''
  const normalize = (s) => (s || '').toString().trim().replace(/^\/+|\/+$/g, '').toLowerCase()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement search here
  }

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    toast.success('Logged out')
  }

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', onClickOutside)
    }
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isProfileOpen])

  return (
    <nav className={`${isScrolled ? 'fixed top-0' : 'relative'} w-full bg-white z-40 transition-all duration-300`}>
      <div className=" mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link className="flex-shrink-0 flex items-center" to={'/'}>
           <img src={logo} alt='logo'  className='w-20'/>
          </Link>

          {/* Search Section - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search globally..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-black bg-white/0 shadow-xs rounded-lg border border-white/30 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all duration-200 placeholder:text-gray-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 " />
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <IoArrowForward className="h-5 w-5 text-gray-400 hover:text-emerald-500 transition-colors duration-200" />
                </button>
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((cat, idx) => {
              const name = getCategoryName(cat)
              const routeName = normalize(name)
              if (!routeName) return null
              return (
                <Link key={cat.id || cat._id || name + idx} to={`/${routeName}`} className="text-gray-700 hover:text-emerald-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 capitalize">
                  {name}
                </Link>
              )
            })}
            {authToken ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileOpen(v => !v)}
                  className="flex items-center text-gray-700 hover:text-emerald-950 px-3 py-2 rounded-md transition-colors duration-200"
                >
                  <FaUserCircle size={26} />
                </button>
                {/* Dropdown */}
                <div
                  className={`absolute right-0 mt-2 w-44 origin-top-right rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-200 ${isProfileOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'}`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-t-xl"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-b-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button onClick={() => { setDefaultTab('signin'); setShowAuth(true) }} className="text-olive bg-dark-green px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200">
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <span
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-emerald-900"
            >
             
              {!isMenuOpen ? (
                   <HiOutlineMenuAlt3 size={30} />
              ) : (
                <RiCloseLargeLine size={20}/>

              )}
            </span>
          </div>
        </div>

        {/* Mobile Search - Visible when menu is open */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search globally..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-black bg-white/20 backdrop-blur-sm rounded-lg border border-white/30 focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/50 transition-all duration-200 placeholder:text-gray-300"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {categories.map((cat, idx) => {
                const name = getCategoryName(cat)
                const routeName = normalize(name)
                if (!routeName) return null
                return (
                  <Link key={cat.id || cat._id || name + idx} to={`/${routeName}`} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200 capitalize">
                    {name}
                  </Link>
                )
              })}
              {authToken ? (
                <div className="px-2 pt-2">
                  <Link onClick={() => setIsMenuOpen(false)} to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200">
                    Profile
                  </Link>
                  <button onClick={() => { setIsMenuOpen(false); handleLogout() }} className="mt-1 block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-2 pt-2">
                  <button onClick={() => { setDefaultTab('signin'); setShowAuth(true); setIsMenuOpen(false) }} className="flex-1 text-center px-3 py-2 rounded-md text-base font-medium text-emerald-700 border border-emerald-600 hover:bg-emerald-50 transition-colors duration-200">
                    Sign In
                  </button>
                  <button onClick={() => { setDefaultTab('signup'); setShowAuth(true); setIsMenuOpen(false) }} className="flex-1 text-center px-3 py-2 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={defaultTab} />
      </div>
    </nav>
  )
}

export default Navbar