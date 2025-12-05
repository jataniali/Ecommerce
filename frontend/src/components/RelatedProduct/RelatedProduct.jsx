import React, { useEffect, useState } from 'react';
import Items from '../Items/Items';
import { useParams } from 'react-router-dom';

const RelatedProduct = () => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { productId } = useParams();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Fetch all products
        const response = await fetch(`${import.meta.env.VITE_API_URL}/allproducts`);
        const data = await response.json();
        
        // Handle paginated response structure
        let allProducts = [];
        if (data.products && Array.isArray(data.products)) {
          allProducts = data.products;
        } else if (Array.isArray(data)) {
          allProducts = data;
        }
        
        // Filter out the current product and get a random sample
        const filteredProducts = allProducts.filter(
          (product) => String(product._id || product.id) !== String(productId)
        );
        
        // Get up to 4 random related products
        const randomProducts = filteredProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);
        
        setRelatedProducts(randomProducts);
        console.log('Related products loaded:', randomProducts.length);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Related Products
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading related products...</p>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't show related products section if none are available
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          You May Also Like
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {relatedProducts.map((item) => (
          <Items
            key={item._id || item.id}
            id={item._id || item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
