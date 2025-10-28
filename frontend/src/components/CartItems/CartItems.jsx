import React, { useContext, useMemo } from 'react';
import { FaTrash, FaTimes } from "react-icons/fa";
import { ShopContext } from '../../context/ShopConext';

const CartItems = () => {
  const { all_products = [], cartitems = {}, gettotalcartamount, removefromcart, isLoading } = useContext(ShopContext);

  // Calculate cart totals safely
  const { cartTotal, cartItemsCount, hasItems } = useMemo(() => {
    if (!Array.isArray(all_products) || !cartitems) {
      return { cartTotal: 0, cartItemsCount: 0, hasItems: false };
    }

    let hasCartItems = false;
    const result = all_products.reduce((acc, product) => {
      const productId = product.id || product._id;
      const quantity = cartitems[productId] || 0;
      if (quantity > 0) {
        acc.cartTotal += (product.new_price || 0) * quantity;
        acc.cartItemsCount += quantity;
        hasCartItems = true;
      }
      return acc;
    }, { cartTotal: 0, cartItemsCount: 0 });

    return { ...result, hasItems: hasCartItems };
  }, [all_products, cartitems]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pt-24 sm:pt-28">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="bg-gray-50 px-4 sm:px-6 py-4 rounded-t-lg">
              <div className="grid grid-cols-5 gap-4 text-sm sm:text-base font-semibold text-gray-700">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p className="text-right">Remove</p>
              </div>
            </div>
            <hr className="border-gray-200" />

            {/* Cart Items */}
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading cart items...</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {!hasItems ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add some products to get started!</p>
                  </div>
                ) : (
                  all_products.map((product) => {
                    const productId = product.id || product._id;
                    const quantity = cartitems[productId] || 0;
                    
                    if (quantity <= 0) return null;
                    
                    return (
                      <div key={productId} className="p-4 sm:p-6">
                        <div className="grid grid-cols-5 gap-4 items-center">
                          {/* Product Image */}
                          <div className="flex justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                            />
                          </div>

                          {/* Product Name */}
                          <div>
                            <p className="text-sm sm:text-base font-medium text-gray-900">{product.name}</p>
                          </div>

                          {/* Price */}
                          <div>
                            <p className="text-sm sm:text-base font-semibold text-gray-900">
                              ${product.new_price?.toFixed(2) || '0.00'}
                            </p>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center justify-center">
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm sm:text-base font-medium">
                              {quantity}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <div className="flex justify-end">
                            <button
                              onClick={() => removefromcart(productId)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                              aria-label={`Remove ${product.name} from cart`}
                            >
                              <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Cart Summary */}
        <div className="space-y-6">
          {/* Cart Totals */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Cart Totals</h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base text-gray-600">Subtotal</p>
                <p className="text-sm sm:text-base font-semibold text-gray-900">
                  ${cartTotal.toFixed(2)}
                </p>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <p className="text-sm sm:text-base text-gray-600">Shipping Fee</p>
                <p className="text-sm sm:text-base font-semibold text-green-600">Free</p>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Total</h3>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  ${cartTotal.toFixed(2)}
                </h3>
              </div>
            </div>
            <button 
              className={`w-full mt-4 sm:mt-6 px-4 sm:px-6 py-3 sm:py-4 font-semibold rounded-lg transition-colors duration-200 
                shadow-lg hover:shadow-xl text-sm sm:text-base ${
                  hasItems 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!hasItems}
            >
              {hasItems ? 'PROCEED TO CHECKOUT' : 'YOUR CART IS EMPTY'}
            </button>
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
            <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
              If you have a promo code, enter it here
            </p>
            <div className="flex gap-2 sm:gap-3">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                  text-sm sm:text-base"
              />
              <button 
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 hover:bg-gray-900
                  text-white font-medium rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
