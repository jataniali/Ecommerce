import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getdefaultcart = () => {
    return {}; 
}

const ShopcontextProvider = (props) => {
    const [all_products, setAllProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Initialize from localStorage if available
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token');
        }
        return false;
    });

 useEffect(() => {
 const fetchProducts = async () => {
try {
const response = await fetch(`${import.meta.env.VITE_API_URL}/allproducts`);
const data = await response.json();
                
                // Handle paginated response structure
                let products = [];
                if (data.products && Array.isArray(data.products)) {
                    products = data.products;
                } else if (Array.isArray(data)) {
                    products = data;
                }
                
                // Log the first few products for debugging
console.log('Fetched products in ShopContext:', products && products.length > 0 ? products.slice(0, 3) : 'No products');
                
                // Ensure all products have consistent ID fields
 const processedProducts = products.map(product => ({
...product,
  // Ensure both id and _id are available and consistent
id: product.id || product._id,
_id: product._id || product.id
}));
 setAllProduct(processedProducts);
 } catch (error) {
                console.error("Error fetching products:", error);
                setAllProduct([]);
} finally {
setIsLoading(false);
}
};
fetchProducts();
}, []);
    
    const [cartitems, setCartitems] = useState(getdefaultcart());

    // Fetch cart data when component mounts and when token changes
    useEffect(() => {
        const fetchCartData = async () => {
            // Ensure we're in a browser environment
            if (typeof window === 'undefined') return;
            
            const token = localStorage.getItem('token');
            if (!token) {
                setCartitems({});
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/getcart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cart data');
                }

                const cartData = await response.json();
                if (cartData) {
                    setCartitems(cartData);
                } else {
                    setCartitems({});
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
                setCartitems({});
            }
        };

        fetchCartData();
    }, [localStorage.getItem('token')]); 

    // Helper function to find a product by ID (handles both string and number IDs)
    const findProductById = (id) => {
        if (!id && id !== 0) return null;
        
        // Convert id to string for comparison
        const idStr = String(id);
        
        return all_products.find(product => 
            String(product.id) === idStr || 
            String(product._id) === idStr
        );
    };

// Helper function to check authentication
const checkAuth = () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
        // Simple token validation (actual validation happens on the server)
        const tokenParts = token.split('.');
        return tokenParts.length === 3;
    } catch (e) {
        return false;
    }
};

const addtocart = async (itemId) => {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            console.error('Not in a browser environment');
            return;
        }

        // Check authentication
        if (!isAuthenticated) {
            if (window.confirm('You need to log in to add items to your cart. Go to login page?')) {
                // Clear any invalid tokens and update state
                handleLogout();
                window.location.href = '/login';
            }
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            handleLogout();
            return;
        }
        
        // Create a clean headers object
        const headers = {
            'Content-Type': 'application/json',
            'token': token
        };
        
        // Make the API call with error handling for network issues
        let response;
        try {
            const requestBody = {
                itemId: String(itemId),
                timestamp: new Date().getTime() // Prevent caching
            };
            
            response = await fetch(`${import.meta.env.VITE_API_URL}/addtocart`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
                cache: 'no-store' // Prevent caching at the fetch API level
            });
        } catch (networkError) {
            console.error('Network error:', networkError);
            throw new Error('Network error. Please check your connection and try again.');
        }

        const data = await response.json().catch(() => ({
            success: false,
            error: 'Invalid server response'
        }));
        
        if (!response.ok) {
            if (response.status === 401) {
                // Clear invalid token and redirect to login
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            throw new Error(data.error || 'Failed to add to cart');
        }

        // Update cart data if successful
        if (data.cartData) {
            setCartitems(data.cartData);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        // Show error message to user
        alert(error.message || 'Failed to add item to cart. Please try again.');
    }
};
    
    const removefromcart = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            
            if (itemId === undefined || itemId === null) {
                console.error('Cannot remove from cart: itemId is undefined or null');
                return;
            }
            
            if (!token) {
                console.error('No authentication token found. Please log in.');
                return;
            }
            
            const itemIdStr = String(itemId);
            
            // Update local state optimistically
            setCartitems((prev) => ({
                ...prev,
                [itemIdStr]: Math.max(0, (prev[itemIdStr] || 0) - 1)
            }));
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/removefromcart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ itemId: itemIdStr })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove item from cart');
            }
            
            // Update with server state if needed
            if (data.cartData) {
                setCartitems(data.cartData);
            }
            
            console.log('Item removed from cart successfully');
        }
         catch (error) {
            console.error('Error removing from cart:', error);
            alert(error.message || 'Failed to remove item from cart. Please try again.');
            
            // Optionally, you could trigger a refetch of the cart here
            // to ensure UI is in sync with server
            if (localStorage.getItem('token')) {
                try {
                    const refreshResponse = await fetch(`${import.meta.env.VITE_API_URL}/getcart`, {
                        headers: {
                            'token': localStorage.getItem('token')
                        }
                    });
                    if (refreshResponse.ok) {
                        const cartData = await refreshResponse.json();
                        setCartitems(cartData);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing cart:', refreshError);
                }
            }
    };
}

    // Calculate cart totals
  const getCartTotals = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { cartTotal: 0, cartItemsCount: 0, hasItems: false };
    }
    
    if (!Array.isArray(all_products) || !cartitems) {
      return { cartTotal: 0, cartItemsCount: 0, hasItems: false };
    }

    let cartTotal = 0;
    let cartItemsCount = 0;
    let hasItems = false;

    for (const product of all_products) {
      const productId = product.id || product._id;
      const quantity = cartitems[productId] || 0;
      if (quantity > 0) {
        cartTotal += (product.new_price || 0) * quantity;
        cartItemsCount += quantity;
        hasItems = true;
      }
    }

    return { cartTotal, cartItemsCount, hasItems };
  };

  const { cartTotal, cartItemsCount, hasItems } = getCartTotals();

    // Calculate total cart amount
    const gettotalcartamount = () => {
        return cartTotal;
    };

    // Get total number of items in cart
    const gettotalcartitems = () => {
        return cartItemsCount;
    };

    // Handle login
    const handleLogin = (token) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
        }
    };

    // Handle logout
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            setCartitems({});
            setIsAuthenticated(false);
        }
    };

    const contextValue = { 
        all_products, 
        cartitems, 
        addtocart, 
        removefromcart,
        gettotalcartamount,
        gettotalcartitems,
        getCartTotals,
        isLoading,
        isAuthenticated,
        handleLogin,
        handleLogout,
        findProductById
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopcontextProvider;