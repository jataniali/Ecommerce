import React, { useState } from 'react';
import { FiUpload, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Use the full backend URL for production
const API_URL = 'https://ecommerce-backend-7lkk.onrender.com';

const Addproduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
    description: ""
  });

  // ✅ Centralized error update
  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};
    if (!productDetails.name.trim()) newErrors.name = 'Product name is required';
    if (!productDetails.new_price || isNaN(productDetails.new_price) || productDetails.new_price <= 0)
      newErrors.new_price = 'Please enter a valid price';
    if (!previewImage) newErrors.image = 'Product image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  // ✅ Handle image file
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      return toast.error('Please select a valid image file (JPEG, PNG, etc.)');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('Image size should be less than 5MB');
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setProductDetails((prev) => ({ ...prev, image: file, imagePreview: previewUrl }));
    clearError('image');
  };

  // ✅ Upload image helper
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('product', file);

    try {
      const response = await fetch(`${API_URL}/upload`, { 
        method: 'POST', 
        body: formData,
        // Don't set Content-Type header, let the browser set it with the correct boundary
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Upload error response:', errorData);
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.image_url) {
        throw new Error('No image URL returned from server');
      }

      return data.image_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return toast.error('Please fill in all required fields correctly');

    setIsLoading(true);
    try {
      const imageUrl = productDetails.image instanceof File
        ? await uploadImage(productDetails.image)
        : productDetails.image;

      const productData = {
        ...productDetails,
        image: imageUrl,
        old_price: productDetails.old_price || (parseFloat(productDetails.new_price) * 1.2).toFixed(2),
      };

      const response = await fetch(`${API_URL}/addproduct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to add product');

      toast.success('Product added successfully!');
      setProductDetails({ name: "", image: "", category: "women", new_price: "", old_price: "", description: "" });
      setPreviewImage(null);

      setTimeout(() => navigate('/listproduct'), 1500);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        </div>

        {/* ✅ UI UNCHANGED */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {previewImage ? (
                    <div className="relative">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mx-auto h-48 w-auto object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setProductDetails((prev) => ({ ...prev, image: "" }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={productDetails.name}
                onChange={handleChange}
                className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md p-2`}
                placeholder="e.g. Cotton T-Shirt"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={productDetails.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Add a detailed description of your product"
              />
            </div>

            {/* Category + Price */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={productDetails.category}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="kids">Kids</option>
                  <option value="electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label htmlFor="new_price" className="block text-sm font-medium text-gray-700">
                  Price ($)<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  name="new_price"
                  id="new_price"
                  value={productDetails.new_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border ${
                    errors.new_price ? 'border-red-300' : 'border-gray-300'
                  } rounded-md p-2`}
                  placeholder="0.00"
                />
                {errors.new_price && <p className="mt-1 text-sm text-red-600">{errors.new_price}</p>}
              </div>

              <div>
                <label htmlFor="old_price" className="block text-sm font-medium text-gray-700">
                  Original Price ($) <span className="text-xs text-gray-500 ml-1">(optional)</span>
                </label>
                <input
                  type="number"
                  name="old_price"
                  id="old_price"
                  value={productDetails.old_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                  placeholder="0.00"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to auto-calculate (20% more than sale price)
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white ${
                  isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
    </div>
  );
};

export default Addproduct;
