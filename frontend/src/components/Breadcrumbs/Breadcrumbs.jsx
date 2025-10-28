import React from 'react'
import { FaArrowRight } from "react-icons/fa";


const Breadcrumbs = (props) => {

const {product}=props;
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 pt-24 sm:pt-28">
      <nav className="flex items-center space-x-2 text-sm sm:text-base">
        {/* HOME Link */}
        <a
          href="/"
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium hover:underline"
        >
          HOME
        </a>

        {/* Arrow */}
        <FaArrowRight className="text-gray-400 text-xs sm:text-sm" />

        {/* SHOP Link */}
        <a
          href="/"
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium hover:underline"
        >
          SHOP
        </a>

        {/* Arrow */}
        <FaArrowRight className="text-gray-400 text-xs sm:text-sm" />

        {/* Category */}
        <span className="text-gray-500 font-normal">
          {product?.category || 'Category'}
        </span>

        {/* Arrow */}
        <FaArrowRight className="text-gray-400 text-xs sm:text-sm" />

        {/* Product Name */}
        <span className="text-gray-900 font-semibold truncate max-w-xs sm:max-w-sm">
          {product?.name || 'Product'}
        </span>
      </nav>
    </div>
  )
}

export default Breadcrumbs
