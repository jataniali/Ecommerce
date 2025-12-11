import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Addproduct from '../../components/Addproduct/Addproduct';
import Listproduct from '../../components/Listproduct/Listproduct';
import Editproduct from '../../components/Editproduct/Editproduct';

const Admin = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/addproduct" replace />} />
              <Route path="/addproduct" element={<Addproduct />} />
              <Route path="/listproduct" element={<Listproduct />} />
              <Route path="/edit-product/:id" element={<Editproduct />} />
              {/* Add a catch-all route that redirects to addproduct */}
              <Route path="*" element={<Navigate to="/admin/addproduct" replace />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
