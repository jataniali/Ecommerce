import React, { useEffect, useState } from 'react';
import Items from '../Items/Items';

const Newcollections = () => {

const [new_collection,setNew_collection]=useState([])

useEffect(()=>{
fetch("http://localhost:4000/newcollections").then((response)=>response.json())
.then((data)=>setNew_collection(data))
})
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          New Collections
        </h2>
        <div className="mt-2 h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Discover our latest arrivals and stay ahead of the trend with our newest collections
        </p>
      </div>
      
      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {new_collection.map((item, i) => (
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

export default Newcollections;
