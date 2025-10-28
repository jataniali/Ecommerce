import React from 'react';
import Logo from '../../assets/logo.jpg';
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
<footer className="bg-gray-900 text-white pt-12 pb-6">
 <div className="container mx-auto px-4">
        {/* Main Footer Content */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Brand */}
<div className="space-y-4">
<div className="flex items-center space-x-2">
 <img 
src={Logo} 
alt="Shopper Logo" 
 className="h-10 w-10 rounded-full object-cover"
/>
<span className="text-2xl font-bold">SHOPPER</span>
 </div>
<p className="text-gray-400">Your one-stop shop for all your needs.</p>
 </div>

          {/* Quick Links */}
<div>
 <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
<ul className="space-y-2 text-gray-400">
<li className="hover:text-white transition-colors cursor-pointer">Home</li>
<li className="hover:text-white transition-colors cursor-pointer">Products</li>
<li className="hover:text-white transition-colors cursor-pointer">Categories</li>
<li className="hover:text-white transition-colors cursor-pointer">New Arrivals</li>
<li className="hover:text-white transition-colors cursor-pointer">Deals</li>
</ul>
 </div>

          {/* Company */}
 <div>
 <h3 className="text-lg font-semibold mb-4">Company</h3>
<ul className="space-y-2 text-gray-400">
<li className="hover:text-white transition-colors cursor-pointer">About Us</li>
<li className="hover:text-white transition-colors cursor-pointer">Our Stores</li>
<li className="hover:text-white transition-colors cursor-pointer">Careers</li>
<li className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</li>
<li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
 </ul>
</div>

          {/* Contact */}
<div>
<h3 className="text-lg font-semibold mb-4">Contact Us</h3>
<ul className="space-y-2 text-gray-400">
<li>Email: jey@shopper.com</li>
<li>Phone: +254757455196</li>
<li>Address: 123 Shopping Nairobi</li>
</ul>
 <div className="flex space-x-4 mt-4">
<a href="#" className="text-gray-400 hover:text-white transition-colors">
<FaFacebook className="h-6 w-6" />
</a>
<a href="#" className="text-gray-400 hover:text-white transition-colors">
<FaInstagram className="h-6 w-6" />
</a>
 <a href="#" className="text-gray-400 hover:text-white transition-colors">
<FaTiktok className="h-6 w-6" />
</a>
<a href="#" className="text-gray-400 hover:text-white transition-colors">
<FaTwitter className="h-6 w-6" />
</a>
</div>
</div>
  </div>

{/* Divider */}
<hr className="border-gray-700 my-6" />

   {/* Copyright */}
<div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
<p className="text-gray-400 text-sm">
  &copy; {currentYear} Shopper. All Rights Reserved.
</p>
<div className="flex space-x-6 mt-4 md:mt-0">
<span className="text-gray-400 text-sm hover:text-white cursor-pointer">Privacy Policy</span>
<span className="text-gray-400 text-sm hover:text-white cursor-pointer">Terms of Service</span>
<span className="text-gray-400 text-sm hover:text-white cursor-pointer">Sitemap</span>
</div>
</div>
 </div>
</footer>
  );
};

export default Footer;
