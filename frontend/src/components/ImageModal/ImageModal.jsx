import React from 'react';

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

export default ImageModal;
