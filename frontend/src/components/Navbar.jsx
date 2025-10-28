import React, { useContext } from 'react';
import logo from '../assets/logo.jpg';
import { FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('Shop');

  const {gettotalcartitems}=useContext(ShopContext)
  // Change navbar style on scroll
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      window.scrollY > 10 ? setIsScrolled(true) : setIsScrolled(false);
    });
  }

  return (
<nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'} ${isMenuOpen ? 'bg-white shadow-md' : ''}`}>
<div className="container mx-auto px-4">
<div className="flex justify-between items-center">
          {/* Logo */}
<div className="flex items-center space-x-2">
<img 
src={logo} 
 alt="Shopper Logo" 
className="h-10 w-10 rounded-full object-cover"
/>
<span className="text-xl font-bold text-gray-800">SHOPPER</span>
</div>

          {/* Desktop Navigation */}
<div className="hidden md:flex items-center space-x-8">
<ul className="flex space-x-8 relative">
{[
  { name: 'Shop', path: '/' },
  { name: 'Men', path: '/mens' },
  { name: 'Women', path: '/womens' },
  { name: 'Electronics', path: '/electronics' }
].map(({ name, path }) => (
  <li key={name} className="relative">
<Link 
  to={path}
  className={`relative px-1 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 ${activeNav === name ? 'text-blue-600' : ''}`}
  onClick={() => setActiveNav(name)}
>
  {name}
  <span 
    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 ${
      activeNav === name ? 'scale-x-100' : 'scale-x-0'
    }`}
  />
</Link>
</li>
))}
</ul>
</div>

  {/* Mobile menu button */}
<div className="md:hidden flex items-center">
<button 
 onClick={() => setIsMenuOpen(!isMenuOpen)}
 className="text-gray-700 hover:text-blue-600 focus:outline-none"
 >
 {isMenuOpen ? (
 <FaTimes className="h-6 w-6" />
) : (
<FaBars className="h-6 w-6" />
)}
</button>
</div>

  {/* Auth and Cart */}
<div className="hidden md:flex items-center space-x-6">
{localStorage.getItem("token") ? (
  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.replace("/");
    }}
    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
  >
    Logout
  </button>
) : (
  <Link to="/login">
    <button className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
      Login
    </button>
  </Link>
)}

<button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200">
<Link to='/cart'>
<FaShoppingCart className="h-5 w-5" />
</Link>
<span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full
 h-5 w-5 flex items-center justify-center">
{gettotalcartitems()}
</span>
 </button>
 </div>
        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="container mx-auto px-4 py-3">
            <ul className="flex flex-col space-y-3">
              {[
                { name: 'Shop', path: '/' },
                { name: 'Men', path: '/mens' },
                { name: 'Women', path: '/womens' },
                { name: 'Electronics', path: '/electronics' },
                { name: 'Login', path: '/login' },
                { name: 'Cart', path: '/cart' }
              ].map(({ name, path }) => (
                <li key={name}>
                  <Link 
                    to={path}
                    className={`block py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 ${activeNav === name ? 'text-blue-600 font-medium' : ''}`}
                    onClick={() => {
                      setActiveNav(name);
                      setIsMenuOpen(false);
                    }}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
</div>
</div>
</nav>
  )
}

export default Navbar
