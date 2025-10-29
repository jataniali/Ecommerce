import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Items = (props) => {
  const navigate = useNavigate();
  
  const handleProductClick = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    navigate(`/product/${props.id}`);
  };

  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  // Function to handle image URL
  const getImageUrl = (url) => {
    if (!url) return '';
    
    // If it's already a full URL, return as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it's a Cloudinary URL without the domain
    if (url.startsWith('ecommerce-products/')) {
      return `https://res.cloudinary.com/dpukfzbtq/image/upload/w_300,h_300,c_fill,q_auto,f_auto/${url}`;
    }
    
    return url;
  };
  
  const imageUrl = getImageUrl(props.image);

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    setImageError(true);
  };

  // If we don't have an image URL, show a placeholder
  if (!imageUrl) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          <span>No image available</span>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2" style={{ height: '3rem' }}>
            {props.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">${props.new_price}</span>
              {props.old_price > props.new_price && (
                <span className="ml-2 text-sm text-gray-500 line-through">${props.old_price}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link to={`/product/${props.id}`} onClick={handleProductClick} className="block">
        <div className="relative pt-[100%] overflow-hidden bg-gray-50">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-200 w-full h-full"></div>
            </div>
          )}
          {!imageError ? (
            <img
              src={imageUrl}
              alt={props.name}
              onError={handleImageError}
              onLoad={() => setImageLoaded(true)}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 mb-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <span>Image not available</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2" style={{ height: '3rem' }}>
            {props.name}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">${props.new_price}</span>
              {props.old_price > props.new_price && (
                <span className="ml-2 text-sm text-gray-500 line-through">${props.old_price}</span>
              )}
            </div>
            {props.old_price > props.new_price && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {Math.round(((props.old_price - props.new_price) / props.old_price) * 100)}% OFF
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Items;
