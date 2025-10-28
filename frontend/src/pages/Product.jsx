import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import Productdisplay from '../components/Productdisplay/Productdisplay';
import Description from '../components/Descriptionbox/Description';
import RelatedProduct from '../components/RelatedProduct/RelatedProduct';

const Product = () => {
  const { all_products, findProductById, isLoading: contextLoading } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Product component mounted with ID:', productId);
    
    if (!productId) {
      const errorMsg = 'No product ID found in URL';
      console.error(errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    // If context is still loading products, wait for it
    if (contextLoading) {
      console.log('Waiting for products to load...');
      return;
    }

    console.log('Searching for product with ID:', productId, 'Type:', typeof productId);
    
    // Debug: Log first few products' IDs for comparison
    if (all_products && all_products.length > 0) {
      console.log('Sample product IDs:', all_products.slice(0, 3).map(p => ({
        id: p.id,
        _id: p._id,
        idType: p.id ? typeof p.id : 'undefined',
        _idType: p._id ? typeof p._id : 'undefined',
        name: p.name
      })));
      
      // Use the context's findProductById function
      const foundProduct = findProductById(productId);
      
      if (foundProduct) {
        console.log('Found product:', foundProduct);
        setProduct(foundProduct);
        setError(null);
      } else {
        const errorMsg = `Product not found. ID: ${productId}`;
        console.error(errorMsg);
        console.error('Available product IDs:', all_products.map(p => p.id || p._id));
        setError(errorMsg);
      }
    } else {
      const errorMsg = 'No products available';
      console.error(errorMsg);
      setError(errorMsg);
    }
    
    setIsLoading(false);
  }, [all_products, productId, navigate, findProductById, contextLoading]);

  if (isLoading || contextLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading product details...</p>
        <p className="text-sm text-gray-500 mt-2">ID: {productId}</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="mt-2 text-2xl font-extrabold text-gray-900">Product Not Found</h2>
        <p className="mt-2 text-base text-gray-500">
          {error || 'The product you are looking for does not exist or has been removed.'}
        </p>
        {productId && (
          <p className="mt-1 text-sm text-gray-500">
            ID: <code className="bg-gray-100 px-2 py-1 rounded">{productId}</code>
          </p>
        )}
        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go back
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs product={product} />
      {product && <Productdisplay product={product} />}
      <Description product={product} />
      <RelatedProduct />
    </div>
  );
};

export default Product;
