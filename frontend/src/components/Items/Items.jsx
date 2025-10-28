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

  const [imageError, setImageError] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState('');

  // Set the image URL when component mounts or image prop changes
  React.useEffect(() => {
    if (props.image) {
      const processedUrl = normalizeImageUrl(props.image);
      setCurrentImage(processedUrl);
      setImageError(false);
    }
  }, [props.image]);

  const handleImageError = (e) => {
    console.error('Failed to load image:', e.target.src);
    setImageError(true);
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
  };

  // If we don't have an image URL, show a placeholder
  if (!props.image) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          <span>No image available</span>
        </div>
        {/* Rest of the component */}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div 
        onClick={handleImageClick} 
        className="cursor-pointer bg-gray-100 flex items-center justify-center"
        style={{ 
          height: '12rem',
          overflow: 'hidden'
        }}
      >
        {currentImage && !imageError ? (
          <img 
            src={currentImage}
            alt={props.name || 'Product image'}
            className="w-full h-full object-contain p-2"
            onError={handleImageError}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="text-center p-4 text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        )}
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
