// Default base URL for production
const DEFAULT_API_URL = 'https://ecommerce-backend-7lkk.onrender.com';

/**
 * Normalizes image URLs to work in both development and production
 * @param {string} imageUrl - The original image URL
 * @returns {string} - The normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Use the production backend URL for all image requests
  const baseUrl = 'https://ecommerce-backend-7lkk.onrender.com';
  
  // Remove any leading slashes to avoid double slashes
  const cleanPath = imageUrl.replace(/^\/+/, '');
  
  // If the path already includes 'images', use it as is
  if (cleanPath.includes('images/')) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  // Otherwise, prepend /images/
  return `${baseUrl}/images/${cleanPath}`;
};

/**
 * Extracts the image filename from a URL
 * @param {string} url - The image URL
 * @returns {string} - The extracted filename
 */
export const getImageFilename = (url) => {
  if (!url) return '';
  return url.split('/').pop();
};
