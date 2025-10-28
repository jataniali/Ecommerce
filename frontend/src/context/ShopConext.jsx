import React, { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

const getdefaultcart = () => {
    return {}; 
}

const ShopcontextProvider = (props) => {
    const [all_products, setAllProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

 useEffect(() => {
 const fetchProducts = async () => {
try {
const response = await fetch("http://localhost:4000/allproducts");
const data = await response.json();
                
                // Log the first few products for debugging
console.log('Fetched products in ShopContext:', data && data.length > 0 ? data.slice(0, 3) : 'No products');
                
                // Ensure all products have consistent ID fields
 const processedProducts = data.map(product => ({
...product,
  // Ensure both id and _id are available and consistent
id: product.id || product._id,
_id: product._id || product.id
}));
 setAllProduct(processedProducts);
 } catch (error) {
                console.error("Error fetching products:", error);
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
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch("http://localhost:4000/getcart", {
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
                }
            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        };

        fetchCartData();
    }, []); 

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

const addtocart = async (itemId) => {
    try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        
        if (!token) {
            console.error('No authentication token found. Please log in.');
            return;
        }

        // Ensure itemId is a string
        const itemIdStr = String(itemId);
        
        const response = await fetch("http://localhost:4000/addtocart", {
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
            throw new Error(data.error || 'Failed to add to cart');
        }

        if (data.cartData) {
            setCartitems(data.cartData);
            console.log('Item added to cart successfully');
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
            
            const response = await fetch("http://localhost:4000/removefromcart", {
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
                    const refreshResponse = await fetch("http://localhost:4000/getcart", {
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

    const gettotalcartamount = () => {
        let totalamount = 0;
        for (const itemId in cartitems) {
            if (cartitems[itemId] > 0) {
                const product = findProductById(itemId);
                if (product && product.new_price) {
                    totalamount += product.new_price * cartitems[itemId];
                }
            }
        }
        return totalamount;
    };

    const gettotalcartitems = () => {
        let totalitem = 0;
        for (const item in cartitems) {
            if (cartitems[item] > 0) {
                totalitem += cartitems[item];
            }
        }
        return totalitem;
    };

    const contextValue = { 
        all_products, 
        cartitems, 
        addtocart, 
        removefromcart, 
        gettotalcartamount, 
        gettotalcartitems,
        findProductById,
        isLoading
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopcontextProvider;