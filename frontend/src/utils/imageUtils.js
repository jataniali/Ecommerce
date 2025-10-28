/**
 * Normalizes image URLs to ensure they work in both development and production
 * @param {string} imageUrl - The original image URL
 * @returns {string} - The normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // If the URL is already absolute, return it as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Get the base URL from environment or use the current origin
  const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
  
  // Remove any leading slashes from the image path
  const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
  
  // If the URL already contains 'images', don't add it again
  if (cleanImageUrl.includes('images/')) {
    return `${baseUrl}/${cleanImageUrl}`;
  }
  
  // Otherwise, assume it's in the images directory
  return `${baseUrl}/images/${cleanImageUrl}`;
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
