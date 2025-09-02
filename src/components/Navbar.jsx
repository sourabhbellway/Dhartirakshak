import React, { useState } from 'react'
import logo from "../assets/DR-Logo.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { RiCloseLargeLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { IoArrowForward } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="fixed top-8 w-full bg-white/0  ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link className="flex-shrink-0 flex items-center">
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
            <Link href="#" className="text-gray-700 hover:text-emerald-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Blogs
            </Link>
            <Link href="#" className="text-gray-700 hover:text-emerald-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Research
            </Link>
            <Link href="#" className="text-gray-700 hover:text-emerald-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Schemes
            </Link>
            <Link href="#" className="text-gray-700 hover:text-emerald-950 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              E-Paper
            </Link>
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
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200">
                Blogs
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200">
                Research
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200">
                Schemes
              </a>
              <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-100 transition-colors duration-200">
                E-Paper
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar