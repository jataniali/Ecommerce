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
  
  // If the URL starts with /images, prepend the API URL
  if (imageUrl.startsWith('/images')) {
    return `${import.meta.env.VITE_API_URL}${imageUrl}`;
  }
  
  // If it's a relative path, assume it's in the images directory
  return `${import.meta.env.VITE_API_URL}/images/${imageUrl}`;
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
