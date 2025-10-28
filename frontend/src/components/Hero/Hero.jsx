import React from 'react';
import laptop from '../../assets/lap-1.jpg';
import { FaArrowRight } from "react-icons/fa";
import { MdWavingHand } from "react-icons/md";
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Hero Content */}
          <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
              <span className="mr-2">New Arrivals</span>
              <MdWavingHand className="text-yellow-500" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
              Latest Collection <br />
              <span className="text-blue-600">for Everyone</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Discover our newest collection of high-quality products designed to enhance your lifestyle. Limited time offers available!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/shop" 
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
              >
                Shop Now
                <FaArrowRight className="ml-2" />
              </Link>
              <Link 
                to="/newcollection" 
                className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
              >
                View New Arrivals
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img 
                src={laptop} 
                alt="Latest Collection" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="hidden lg:block absolute -bottom-8 -right-8 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="hidden lg:block absolute -top-8 -left-8 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
        </div>
      </div>
      
      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg 
          className="w-full h-16 md:h-24 lg:h-32 text-white" 
          viewBox="0 0 1440 200" 
          preserveAspectRatio="none"
        >
          <path 
            fill="currentColor" 
            d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,101.3C672,96,768,128,864,138.7C960,149,1056,139,1152,117.3C1248,96,1344,64,1392,48L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
