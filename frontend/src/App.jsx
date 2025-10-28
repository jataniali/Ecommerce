import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './pages/shop';
import Shopcategory from './pages/shopcategory';
import Product from './pages/Product.jsx';
import Cart from './pages/cart';
import Loginsignup from './pages/loginsignup';
import Footer from './components/Footer/Footer';
import women_bunner from './assets/womencloth-banner.jpg';
import men_bunner from './assets/menbanner2.jpg';
import electronic_bunner from './assets/electronic-bunners.jpg';
import Popular from './components/Popular/Popular.jsx';
import Newcollections from './components/Newcollection/Newcollections.jsx';
import RelatedProduct from './components/RelatedProduct/RelatedProduct.jsx';


const App = () => {
  return (
    
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
       <Route path='/products' element={<Shopcategory category="all" />} />
          <Route path='/mens' element={<Shopcategory bunner={men_bunner} category="mens" />} />
          <Route path='/womens' element={<Shopcategory bunner={women_bunner} category="women" />} />
          <Route path='/electronics' element={<Shopcategory bunner={electronic_bunner} category="electronics" />} />
          <Route path='/product/:productId' element={<Product />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/login' element={<Loginsignup />} />
          <Route path='/shop' element={<Popular />} />
          <Route path='/newcollection' element={<Newcollections />} />
          <Route path='/relatedproduct' element={<RelatedProduct />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    
  );
};

export default App;
