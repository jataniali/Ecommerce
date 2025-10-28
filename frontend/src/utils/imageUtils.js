/**
 * Normalizes image URLs to ensure they work in both development and production
 * @param {string} imageUrl - The original image URL
 * @returns {string} - The normalized image URL
 */
export const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return '';

  try {
    // If the URL is already absolute, return it as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // Get the base URL from environment or use the current origin
    // Ensure we don't have double slashes when joining URLs
    let baseUrl = (import.meta.env.VITE_API_URL || window.location.origin).replace(/\/+$/, '');
    
    // Handle cases where VITE_API_URL might be undefined in production
    if (!baseUrl) {
      console.warn('VITE_API_URL is not set, using current origin as base URL');
      baseUrl = window.location.origin;
    }

    // Handle different URL formats
    if (imageUrl.startsWith('/images/')) {
      // If it's already in the correct format, just prepend the base URL
      return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    
    // Handle the case where the URL might already have the full path
    if (imageUrl.includes('/images/')) {
      const imagePath = imageUrl.split('/images/').pop();
      return `${baseUrl}/images/${imagePath}`;
    }
    
    // For relative paths that don't start with /images
    if (!imageUrl.startsWith('/')) {
      return `${baseUrl}/images/${imageUrl}`;
    }
    
    // For absolute paths that don't include /images
    return `${baseUrl}${imageUrl}`;
  } catch (error) {
    console.error('Error normalizing image URL:', error);
    return ''; // Return empty string or a default image URL
  }
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
