import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLeaf,
  FaArrowRight
} from 'react-icons/fa'
import logo from '../assets/DR-Logo.png'
import appstoreBadge from '../assets/appstore.png'
import googleplayBadge from '../assets/googleplay.png'
const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    
    setSubscribing(true)
    // Simulate newsletter subscription
    setTimeout(() => {
      setSubscribing(false)
      setSubscribed(true)
      setEmail('')
    }, 1000)
  }

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Research', path: '/research' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'E-Papers', path: '/epapers' }
  ]

  const services = [
    { name: 'Agricultural Research', path: '/research' },
    { name: 'News & Updates', path: '/blogs' },
    { name: 'Government Schemes', path: '/schemes' },
    { name: 'Digital Publications', path: '/epapers' },
    { name: 'Community Forum', path: '/community' },
    { name: 'Expert Consultation', path: '/consultation' }
  ]

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebookF, url: '#' },
    { name: 'Twitter', icon: FaTwitter, url: '#' },
    { name: 'Instagram', icon: FaInstagram, url: '#' },
    { name: 'YouTube', icon: FaYoutube, url: '#' },
    { name: 'LinkedIn', icon: FaLinkedinIn, url: '#' }
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200 mt-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info & Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src={logo} 
                alt="DhartiRakshak Logo" 
                className="w-25 mr-4"
              />
             
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Empowering farmers through innovative technology, research, and knowledge sharing. 
              Building a sustainable future for agriculture.
            </p>
            
            {/* Trust Indicators */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FaLeaf className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800 font-semibold text-sm">Trusted by 10,000+ Farmers</span>
              </div>
              <p className="text-emerald-700 text-xs">Join our growing community of successful agricultural innovators.</p>
            </div>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-lime-900 transition-all duration-300 group shadow-sm"
                    title={social.name}
                  >
                    <IconComponent className="w-4 h-4 text-gray-600 group-hover:text-white" />
                  </a>
                )
              })}
            </div>
            
            {/* Awards & Recognition */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h5 className="text-gray-800 font-semibold text-sm mb-3">Awards & Recognition</h5>
              <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">Best Agri-Tech 2024</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Innovation Award</span>
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Sustainability Leader</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-emerald-600"></div>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-emerald-600 transition-all duration-300 text-sm flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Additional Info */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold text-gray-800 text-sm mb-2">Need Help?</h5>
              <p className="text-gray-600 text-xs mb-3">Our support team is here to assist you 24/7</p>
              <Link to="/contact" className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                Get Support →
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6 relative">
              Our Services
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-emerald-600"></div>
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.path}
                    className="text-gray-600 hover:text-emerald-600 transition-all duration-300 text-sm flex items-center group"
                  >
                    <FaArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-emerald-600 font-bold text-lg">500+</div>
                <div className="text-gray-600 text-xs">Research Papers</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-bold text-lg">50+</div>
                <div className="text-gray-600 text-xs">Experts</div>
              </div>
            </div>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Stay Updated</h4>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-3">
                Subscribe to our newsletter for the latest agricultural news and updates.
              </p>
              {subscribed ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✅</span>
                    <p className="text-emerald-800 text-sm">Thank you for subscribing!</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full bg-lime-800 text-white py-2 px-3 rounded-md hover:bg-lime-700 disabled:opacity-50 text-sm transition-colors"
                  >
                    {subscribing ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-600 text-sm">info@dhartirakshak.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaPhone className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-600 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mt-0.5">
                  <FaMapMarkerAlt className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-gray-600 text-sm">123 Agriculture Street, Farm City, FC 12345</span>
              </div>
            </div>
            
            {/* Download App */}
            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
              <h5 className="font-semibold text-gray-800 text-sm mb-2">Download Our App</h5>
              <p className="text-gray-600 text-xs mb-3">Get instant access to agricultural insights on the go</p>
              <div className="flex gap-3 items-center">
                <a href="#" target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <img src={appstoreBadge} alt="Download on the App Store" className="h-10 w-auto rounded-md border border-gray-200" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="shrink-0">
                  <img src={googleplayBadge} alt="Get it on Google Play" className="h-10 w-auto rounded-md border border-gray-200" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <FaLeaf className="w-4 h-4 text-emerald-600" />
              <span className="text-gray-600 text-sm">
                © {new Date().getFullYear()} DhartiRakshak. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-8">
              <Link to="/privacy" className="text-gray-600 hover:text-emerald-600 text-sm transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-600 hover:text-emerald-600 text-sm transition-colors font-medium">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-emerald-600 text-sm transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
