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
  const [imageLoading, setImageLoading] = React.useState(true);
  const [currentImage, setCurrentImage] = React.useState('');

  // Preprocess the image URL when the component mounts or when props.image changes
  React.useEffect(() => {
    if (props.image) {
      const processedUrl = normalizeImageUrl(props.image);
      console.log(`Processing image URL: ${props.image} -> ${processedUrl}`);
      setCurrentImage(processedUrl);
      setImageError(false);
      setImageLoading(true);
    }
  }, [props.image]);

  const handleImageError = (e) => {
    console.error('Error loading image:', {
      originalUrl: props.image,
      processedUrl: currentImage,
      error: e
    });
    setImageError(true);
    // Only try to set the fallback if we haven't already tried it
    if (e.target.src !== 'https://via.placeholder.com/300x200?text=Image+Not+Available') {
      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
    }
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', currentImage);
    setImageLoading(false);
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
        className="cursor-pointer relative bg-gray-100"
        style={{ minHeight: '12rem' }}
      >
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse w-full h-full bg-gray-200"></div>
          </div>
        )}
        <img 
          key={currentImage} // Force re-render when image changes
          src={currentImage}
          alt={props.name || 'Product image'}
          className={`w-full h-48 object-contain bg-white ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
          style={{
            minHeight: '12rem',
            maxHeight: '12rem',
            objectFit: 'contain',
            padding: '0.5rem'
          }}
        />
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <span>Image not available</span>
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
