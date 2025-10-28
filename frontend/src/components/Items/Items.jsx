import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { normalizeImageUrl } from '../../utils/imageUtils';

const Items = (props) => {
  const navigate = useNavigate();
  
  const handleProductClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(`/product/${props.id}`);
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(`/product/${props.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div onClick={handleImageClick} className="cursor-pointer">
        <img 
          src={normalizeImageUrl(props.image)} 
          alt={props.name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          onError={(e) => {
            console.error('Error loading image:', props.image);
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          }}
        />
      </div>
      <div className="p-4">
        <Link 
          to={`/product/${props.id}`} 
          onClick={handleProductClick}
          className="text-gray-800 font-medium mb-2 hover:text-blue-600 transition-colors block"
        >
          {props.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${props.new_price}</span>
          {props.old_price && (
            <span className="text-sm text-gray-500 line-through">${props.old_price}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Items
