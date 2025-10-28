import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import { Link } from 'react-router-dom';

// Simple Image Modal Component
const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl"
        >
          ✕
        </button>
        <img 
          src={imageUrl} 
          alt="Enlarged view"
          className="max-w-full max-h-[80vh] mx-auto object-contain"
        />
      </div>
    </div>
  );
};
const Listproduct = () => {
  const [allproduct, setAllproduct] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (e, imageUrl) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

const fetchinfo = async () => {
  try {
    const response = await fetch('http://localhost:4000/allproducts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // Log the first few products for debugging
    console.log('Fetched products:', data);
    if (data && data.length > 0) {
      console.log('First product:', {
        _id: data[0]._id,
        _idType: typeof data[0]._id,
        id: data[0].id,
        idType: typeof data[0].id,
        name: data[0].name
      });
    }
    
    // Ensure all products have an _id
    const productsWithIds = data.map(product => {
      if (!product._id && product.id) {
        return { ...product, _id: product.id };
      }
      return product;
    });
    
    setAllproduct(productsWithIds);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
};

useEffect(()=>{
fetchinfo()
},[])

const removeproduct= async(id)=>{
await fetch('http://localhost:4000/removeproduct',{
method:'POST',
headers:{
Accept:'application/json',
'Content-Type':'application/json',},
body:JSON.stringify({id:id}),
})
await fetchinfo()
}
  console.log('Rendering with products:', allproduct);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h1 className="text-2xl font-bold text-gray-900">Products List</h1>
        <p className="mt-1 text-sm text-gray-600">Manage and view all your products</p>
      </div>
      <div className="border-t border-gray-200">
  {/* Responsive Table Header */}
  <div className="bg-gray-50 px-4 py-3">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
      <div className="font-medium text-gray-500 text-xs sm:text-sm">
        <span className="md:hidden">Product & </span>Image
      </div>
      <div className="font-medium text-gray-500 text-xs sm:text-sm">
        <span className="md:hidden">Details</span>
        <span className="hidden md:inline">Title</span>
      </div>
      <div className="font-medium text-gray-500 text-xs sm:text-sm col-span-2 md:col-span-1">
        <span className="md:hidden">Pricing</span>
        <span className="hidden md:inline">Old Price</span>
      </div>
      <div className="font-medium text-gray-500 text-xs sm:text-sm col-span-2 md:col-span-1">
        <span className="md:hidden">& New</span>
        <span className="hidden md:inline">New Price</span>
      </div>
      <div className="font-medium text-gray-500 text-xs sm:text-sm">
        <span className="md:hidden">Type</span>
        <span className="hidden md:inline">Category</span>
      </div>
      <div className="font-medium text-gray-500 text-xs sm:text-sm">
        <span className="md:hidden">Action</span>
        <span className="hidden md:inline">Remove</span>
      </div>
    </div>
  </div>

  {/* Responsive Table Body */}
  <div className="bg-white">
    {allproduct.length === 0 ? (
      <div className="px-4 py-8 text-center text-gray-500">
        <p className="text-lg mb-2">No products found</p>
        <p className="text-sm">Add your first product to get started!</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-200">
        {allproduct.map((product, i) => (
          <div key={i} className="px-4 py-4 hover:bg-gray-50">
            {/* Desktop Table Row */}
            <div className="hidden md:grid grid-cols-6 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 overflow-hidden rounded-lg cursor-pointer"
                  onClick={(e) => handleImageClick(e, product.image)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              </div>
              <div>
                {(() => {
                  const productId = product._id || product.id;
                  return productId ? (
                    <>
                      <Link 
                        to={`/product/${productId}`} 
                        className="font-medium text-gray-900 truncate hover:text-blue-600 transition-colors"
                        onClick={(e) => {
                          console.log('Navigating to product:', productId);
                        }}
                      >
                        {product.name}
                      </Link>
                      <div className="text-xs text-gray-500">ID: {productId}</div>
                    </>
                  ) : (
                    <div>
                      <span className="font-medium text-gray-900 truncate">
                        {product.name} <span className="text-red-500 text-xs">(No ID)</span>
                      </span>
                      <div className="text-xs text-red-500">Error: Missing product ID</div>
                    </div>
                  );
                })()}
              </div>
              <div>
                <p className="text-gray-600">${product.old_price}</p>
              </div>
              <div>
                <p className="font-semibold text-green-600">${product.new_price}</p>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {product.category}
                </span>
              </div>
              <div>
                <button className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded-full hover:bg-red-50">
                  <MdDelete onClick={() => removeproduct(product._id)} className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg cursor-pointer"
                  onClick={(e) => handleImageClick(e, product.image)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
                <div className="flex-1">
                  {(() => {
                    const productId = product._id || product.id;
                    return productId ? (
                      <>
                        <Link 
                          to={`/product/${productId}`} 
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                          onClick={(e) => {
                            console.log('Mobile - Navigating to product:', productId);
                          }}
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="text-xs text-gray-400">ID: {productId}</p>
                      </>
                    ) : (
                      <div>
                        <span className="font-medium text-gray-900">
                          {product.name} <span className="text-red-500 text-xs">(No ID)</span>
                        </span>
                        <p className="text-xs text-red-500">Error: Missing product ID</p>
                      </div>
                    );
                  })()}
                </div>
                <button className="text-red-600 cursor-pointer hover:text-red-900 p-2 rounded-full hover:bg-red-50">
                  <MdDelete onClick={() => removeproduct(product._id)} className="h-5 w-5" />
                </button>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-600">Old: </span>
                  <span className="font-medium">${product.old_price}</span>
                </div>
                <div>
                  <span className="text-gray-600">New: </span>
                  <span className="font-semibold text-green-600">${product.new_price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
      </div>
      
      {isModalOpen && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default Listproduct;
