import React, { useEffect, useState } from 'react';
import Items from '../Items/Items.jsx';

const Popular = () => {
const[data_product,setData_product]=useState([])
useEffect(()=>{
fetch(`${import.meta.env.VITE_API_URL}/popular`).then((response)=>response.json())
.then((data)=>setData_product(data))
},[])
  return (
<section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Popular in the Market
        </h2>
        <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data_product.map((item, i) => (
          <Items 
            key={item._id || item.id} 
            id={item._id || item.id}
            name={item.name}
            image={item.image} 
            new_price={item.new_price} 
            old_price={item.old_price}
          />
        ))}
      </div>
</section>
  );
};

export default Popular;
