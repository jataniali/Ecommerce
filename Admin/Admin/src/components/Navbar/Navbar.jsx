import React, { useState } from 'react'
import logo from '../../assets/logo.jpg'
import { HiUser, HiMenu, HiX, HiLogout, HiCog } from "react-icons/hi";
import { Link} from 'react-router-dom'
import { BsPlusCircle } from "react-icons/bs";
import { FaList } from "react-icons/fa"; 
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  return (
    <>
      {/* Navbar */}
<nav className="bg-gray-900 shadow-lg border-b border-gray-700">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between h-16">
            {/* Logo and Mobile menu button */}
 <div className="flex items-center">
<button
onClick={toggleMenu}
className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
 >
{isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
</button>
<div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
<img className="h-8 w-auto" src={logo} alt="Logo" />
<span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
</div>
</div>

            {/* Desktop Navigation */}
<div className="hidden lg:flex items-center space-x-4">
<Link to={'/addproduct'} className="text-gray-300 hover:text-white px-3 py-2 rounded-md 
text-sm font-medium flex items-center">
<BsPlusCircle className="mr-2 h-5 w-5" />
Add Product
</Link>
 <Link to={'/listproduct'} className="text-gray-300 hover:text-white px-3 py-2 
 rounded-md text-sm font-medium flex items-center">
<FaList className="mr-2 h-5 w-5" />
Products List
</Link>
</div>

            {/* Profile dropdown */}
<div className="flex items-center">
<div className="relative ml-3">
<button
onClick={toggleProfile}
 className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
>
<span className="sr-only">Open user menu</span>
<div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
<HiUser className="h-5 w-5 text-white" />
</div>
</button>

         {/* Profile dropdown menu */}
 {isProfileOpen && (
<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
 <a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
<HiUser className="mr-2 h-4 w-4" />
Your Profile
</a>
<a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
<HiCog className="mr-2 h-4 w-4" />
Settings
</a>
<a href="#" className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
<HiLogout className="mr-2 h-4 w-4" />
Sign out
</a>
</div>
)}
</div>
</div>
 </div>
</div>
</nav>

  {/* Mobile menu overlay */}
{isMenuOpen && (
<div className="lg:hidden">
<div className="fixed inset-0 z-40" onClick={toggleMenu}></div>
<div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 shadow-xl">
<div className="flex items-center justify-between p-4 border-b border-gray-700">
<div className="flex items-center">
<img className="h-8 w-auto" src={logo} alt="Logo" />
 <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
</div>
 <button
 onClick={toggleMenu}
className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
>
<HiX className="h-6 w-6" />
</button>
</div>
<div className="py-4">
<Link to={'/addproduct'} className="text-gray-300 hover:text-white px-4 py-3 rounded-md text-base font-medium flex items-center w-full">
<BsPlusCircle className="mr-3 h-5 w-5" />
Add Product
</Link>
<Link to={'/listproduct'} className="text-gray-300 hover:text-white px-4 py-3 rounded-md text-base font-medium flex items-center w-full">
<FaList className="mr-3 h-5 w-5" />
 Products List
</Link>
</div>
</div>
</div>
)}
    </>
  )
}

export default Navbar
