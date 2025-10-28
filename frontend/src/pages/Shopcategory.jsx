import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {  FaChevronDown} from "react-icons/fa";
import Items from '../components/Items/Items';
import { Link } from 'react-router-dom';

const Shopcategory = (props) => {

const{all_products}=useContext(ShopContext)
  return (
<div className="min-h-screen bg-gray-50">
  {/* Enhanced Banner Section */}
  <div className="relative w-full h-72 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
    <img
      src={props.bunner}
      alt="Category Banner"
      className="w-full h-full object-cover opacity-80 brightness-90"
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10">
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
        {props.category.charAt(0).toUpperCase() + props.category.slice(1)}
      </h1>
      <p className="text-xl opacity-90 drop-shadow-md">
        Discover amazing products in this category
      </p>
    </div>
  </div>

  {/* Enhanced Controls Section */}
  <div className="flex flex-col sm:flex-row justify-between items-center p-5 bg-white shadow-md mx-4 sm:mx-8 lg:mx-16 my-6 rounded-lg gap-4">
    <div className="text-lg font-medium text-gray-700">
      <span className="text-blue-500 font-bold">Showing 1-12</span> out of 36 Products
    </div>

    <div className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-full bg-gray-50 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 text-sm font-medium text-gray-700">
      Sort by <FaChevronDown className="ml-2" />
    </div>
  </div>

  {/* Enhanced Products Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
    {all_products.map((item,i)=>{
      if(props.category===item.category){
        return (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            <Items
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          </div>
        )
      }
      else{
        return null
      }
    })}
  </div>

  {/* Load More Section */}
  <div className="text-center py-12 mt-8">
    <Link to='/relatedproduct' className="px-8 py-4 bg-blue-500 text-white border-none rounded-full text-lg font-semibold cursor-pointer hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
      Explore More Products
    </Link>
  </div>
</div>
  )
}

export default Shopcategory
