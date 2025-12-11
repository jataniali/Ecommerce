import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import {  FaChevronDown} from "react-icons/fa";
import Items from '../components/Items/Items';
import { Link } from 'react-router-dom';

const Shopcategory = (props) => {

const{all_products}=useContext(ShopContext)
  
  // Optimize filtering with useMemo to prevent re-calculating on every render
  const filteredProducts = useMemo(() => {
    console.log(`Shopcategory: Filtering ${all_products.length} products for category "${props.category}"`);
    const all_categories = [...new Set(all_products.map(p => p.category))];
    console.log('All available categories:', all_categories);
    console.log('Products with their categories:', all_products.map(p => ({ name: p.name, category: p.category })));
    const startTime = performance.now();
    
    const filtered = all_products
      .filter(item => {
        if (!item.category) return false;
        
        const productCategory = item.category.toString().toLowerCase().trim();
        const currentCategory = props.category ? props.category.toString().toLowerCase().trim() : '';
        
        // Direct match for exact category values
        if (productCategory === currentCategory) {
          console.log(`Direct match: ${item.name} in category ${item.category}`);
          return true;
        }
        
        // Handle men's category variations
        if (currentCategory === 'men' || currentCategory === "men's" || currentCategory === 'mens') {
          const menCategories = ['men', 'mens', "men's"];
          const isMatch = menCategories.includes(productCategory);
          if (isMatch) {
            console.log(`Men's category match: ${item.name} in ${productCategory}`);
          }
          return isMatch;
        }
        
        // Handle women's category variations
        if (currentCategory === 'women' || currentCategory === "women's") {
          const womenCategories = ['women', 'womens', "women's"];
          const isMatch = womenCategories.includes(productCategory);
          if (isMatch) {
            console.log(`Women's category match: ${item.name} in ${productCategory}`);
          }
          return isMatch;
        }
        
        // Handle kids category
        if (currentCategory === 'kids') {
          const isMatch = productCategory === 'kids';
          if (isMatch) {
            console.log(`Kids category match: ${item.name} in ${productCategory}`);
          }
          return isMatch;
        }
        
        // Handle electronics category
        if (currentCategory === 'electronics') {
          const electronicsCategories = ['electronics', 'electronic'];
          const isMatch = electronicsCategories.includes(productCategory);
          if (isMatch) {
            console.log(`Electronics category match: ${item.name} in ${productCategory}`);
          }
          return isMatch;
        }
        
        return false;
      });
    
    console.log(`Shopcategory: Filtered ${filtered.length} products in ${(performance.now() - startTime).toFixed(2)}ms`);
    return filtered;
  }, [all_products, props.category]);
  
  return (
<div className="min-h-screen bg-gray-50">
  {/* Debug info */}
  {console.log('Current props:', { 
    category: props.category,
    banner: props.bunner,
    allCategories: [...new Set(all_products.map(p => p.category))]
  })}
  
  {/* Enhanced Banner Section */}
  <div className="relative w-full h-72 overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
    <img
      src={props.bunner}
      alt="Category Banner"
      className="w-full h-full object-cover opacity-80 brightness-90"
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center z-10">
      <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
        {['men', 'mens', "men's"].includes(props.category.toLowerCase()) 
          ? "Men's" 
          : props.category.charAt(0).toUpperCase() + props.category.slice(1)}
      </h1>
      <p className="text-xl opacity-90 drop-shadow-md">
        Discover amazing products in this category
      </p>
    </div>
  </div>

  {/* Enhanced Controls Section */}
  <div className="flex flex-col sm:flex-row justify-between items-center p-5 bg-white shadow-md mx-4 sm:mx-8 lg:mx-16 my-6 rounded-lg gap-4">
    <div className="text-lg font-medium text-gray-700">
      <span className="text-blue-500 font-bold">Showing 1-12</span> out of 36 Products
    </div>

    <div className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-gray-300 rounded-full bg-gray-50 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 text-sm font-medium text-gray-700">
      Sort by <FaChevronDown className="ml-2" />
    </div>
  </div>

  {/* Enhanced Products Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto">
    {filteredProducts.length > 0 ? (
      filteredProducts.map((item, i) => {
        console.log(`Rendering item ${i}:`, item);
        return (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <Items
            id={item.id}
            name={item.name}
            image={item.image}
            new_price={item.new_price}
            old_price={item.old_price}
          />
        </div>
      );
    })
    ) : (
      <div className="col-span-full text-center py-12">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found in this category</h3>
          <p className="text-gray-500">Try checking other categories or add some products to this category.</p>
        </div>
      </div>
    )}
  </div>

  {/* Load More Section */}
  <div className="text-center py-12 mt-8">
    <Link to='/relatedproduct' className="px-8 py-4 bg-blue-500 text-white border-none rounded-full text-lg font-semibold cursor-pointer hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
      Explore More Products
    </Link>
  </div>
</div>
  )
}

export default Shopcategory
