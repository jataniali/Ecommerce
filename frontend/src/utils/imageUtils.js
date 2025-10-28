// Default base URL for your backend on Render
const DEFAULT_API_URL = 'https://ecommerce-backend-7lkk.onrender.com';

/**
 * Normalizes image URLs to work in both development and production
 * @param {string} imageUrl - The original image URL
 * @returns {string} - The normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';

  // If the URL is already complete (starts with http), return as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Remove any double slashes and leading slashes
  const cleanPath = imageUrl.replace(/^\/+/, '');

  // Ensure only one /images/ prefix
  if (cleanPath.startsWith('images/')) {
    return `${DEFAULT_API_URL}/${cleanPath}`;
  }

  return `${DEFAULT_API_URL}/images/${cleanPath}`;
};

/**
 * Extracts filename from URL (optional helper)
 */
export const getImageFilename = (url) => {
  if (!url) return '';
  return url.split('/').pop();
};
