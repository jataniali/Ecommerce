import React from 'react';
import exclusive from '../../assets/exclusive.webp';
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden my-12 mx-4 md:mx-8 lg:mx-auto max-w-7xl">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Offers Content */}
        <div className="p-8 md:p-12 text-center md:text-left">
          <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
            LIMITED TIME OFFER
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Exclusive <span className="text-blue-600">Offers</span> For You
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto md:mx-0">
            ONLY ON BEST SELLERS PRODUCTS
          </p>
          <Link 
            to="/shop"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Check Now
          </Link>
        </div>

        {/* Offers Image */}
        <div className="h-64 md:h-auto overflow-hidden">
          <img 
            src={exclusive} 
            alt="Exclusive Offers" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default Offers;
