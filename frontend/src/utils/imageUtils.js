/**
 * Normalizes image URLs for Cloudinary
 * @param {string} imageUrl - The Cloudinary image URL
 * @returns {string} - The normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a Cloudinary public ID (starts with 'ecommerce-products/')
  if (imageUrl.startsWith('ecommerce-products/')) {
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${imageUrl}`;
  }
  
  return imageUrl; // Fallback for any other cases
};

/**
 * Gets optimized image URL with transformations
 * @param {string} imageUrl - The original image URL or Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Transformed image URL
 */
export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl) return '';
  
  const defaultOptions = {
    width: 500,
    height: 500,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
    ...options
  };
  
  // If it's already a full Cloudinary URL
  if (imageUrl.includes('res.cloudinary.com')) {
    const parts = imageUrl.split('/upload/');
    if (parts.length === 2) {
      const transformations = Object.entries(defaultOptions)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');
      return `${parts[0]}/upload/${transformations}/${parts[1]}`;
    }
    return imageUrl;
  }
  
  // If it's a Cloudinary public ID
  if (imageUrl.startsWith('ecommerce-products/')) {
    const transformations = Object.entries(defaultOptions)
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${imageUrl}`;
  }
  
  return imageUrl; // Fallback for other URLs
};
