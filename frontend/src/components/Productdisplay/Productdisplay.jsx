import React, { useContext, useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { ShopContext } from '../../context/ShopContext';
import ImageModal from '../ImageModal/ImageModal';

const Productdisplay = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { product } = props;
  const { addtocart } = useContext(ShopContext);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
// Safety check for product object
if (!product) {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 bg-white">
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found</p>
      </div>
    </div>
  );
}

  return (
<div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 bg-white">
  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
    {/* Product Images Section */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:w-1/2">
      {/* Thumbnail Images */}
      <div className="flex sm:flex-col gap-2 sm:gap-3 order-2 sm:order-1 justify-center sm:justify-start">
        <img 
          src={product?.image || '/placeholder-image.jpg'} 
          alt="Product thumbnail 1"
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200"
          onClick={() => handleImageClick(product?.image)}
        />
        <img src={product?.image || '/placeholder-image.jpg'} alt="Product thumbnail 2"
             className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200" />
        <img src={product?.image || '/placeholder-image.jpg'} alt="Product thumbnail 3"
             className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200" />
        <img src={product?.image || '/placeholder-image.jpg'} alt="Product thumbnail 4"
             className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-cover rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200" />
      </div>

      {/* Main Image */}
      <div className="flex-1 order-1 sm:order-2">
        <img 
          src={product?.image || '/placeholder-image.jpg'} 
          alt={product?.name || 'Product Image'}
          className="w-full max-w-lg mx-auto h-64 sm:h-80 lg:h-96 xl:h-[500px] object-cover rounded-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleImageClick(product?.image)}
        />
      </div>
      
      {/* Image Modal */}
      {isModalOpen && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={closeModal} 
        />
      )}
    </div>

    {/* Product Information Section */}
    <div className="lg:w-1/2 space-y-4 sm:space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 leading-tight">{product?.name || 'Product Name'}</h1>
      </div>

      {/* Star Rating */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 text-yellow-400 text-base sm:text-lg">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStarHalfAlt />
          <FaRegStar />
        </div>
        <span className="text-gray-600 text-xs sm:text-sm">(122 reviews)</span>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">${product?.old_price || '0.00'}</span>
        <span className="text-lg sm:text-xl text-gray-500 line-through">${product?.old_price || '0.00'}</span>
      </div>

      {/* Description */}
      <div className="text-gray-700 leading-relaxed">
        <p className="text-sm sm:text-base">
          Classic cotton shirt designed for everyday comfort and style.
          Perfect for casual or semi-formal occasions.
        </p>
      </div>

      {/* Size Selection */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Select Size</h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              className="px-3 sm:px-4 py-2 sm:py-2 border-2 border-gray-300 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:text-gray-900 text-sm sm:text-base min-w-[2.5rem] sm:min-w-[3rem]"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="pt-3 sm:pt-4">
        <button 
          onClick={(e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            if (!token) {
              alert('Please log in to add items to your cart');
              // Optionally redirect to login page:
              // window.location.href = '/login';
              return;
            }
            addtocart(product.id);
          }}
          className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
        >
          ADD TO CART
        </button>
      </div>

      {/* Category and Tags */}
      <div className="space-y-2 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Category:</span>
          <span className="text-gray-600 text-sm sm:text-base">Women, sneakers, dress</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span className="font-semibold text-gray-900 text-sm sm:text-base">Tags:</span>
          <span className="text-gray-600 text-sm sm:text-base">Modern, Latest</span>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}

export default Productdisplay
