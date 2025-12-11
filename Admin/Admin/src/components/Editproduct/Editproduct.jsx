import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUpload } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'https://ecommerce-backend-7lkk.onrender.com';

const Editproduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    category: '',
    new_price: '',
    old_price: '',
    image: ''
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/product/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct({
            name: data.product.name,
            category: data.product.category,
            new_price: data.product.new_price,
            old_price: data.product.old_price,
            image: data.product.image
          });
        } else {
          toast.error('Product not found');
          navigate('/listproduct');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
        navigate('/listproduct');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/updateproduct/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Product updated successfully!');
        setTimeout(() => {
          navigate('/listproduct');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="mt-1 text-sm text-gray-500">Update product information</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={product.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a category</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="new_price" className="block text-sm font-medium text-gray-700 mb-1">
                  New Price ($)
                </label>
                <input
                  type="number"
                  id="new_price"
                  name="new_price"
                  value={product.new_price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="old_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Old Price ($)
                </label>
                <input
                  type="number"
                  id="old_price"
                  name="old_price"
                  value={product.old_price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={product.image}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
              {product.image && (
                <div className="mt-2">
                  <img
                    src={product.image}
                    alt="Product preview"
                    className="h-32 w-32 object-cover rounded-md border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/128';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/listproduct')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiX className="-ml-1 mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="-ml-1 mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Editproduct;
