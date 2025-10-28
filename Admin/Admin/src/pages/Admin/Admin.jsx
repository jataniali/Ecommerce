import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Addproduct from '../../components/Addproduct/Addproduct'
import Listproduct from '../../components/Listproduct/Listproduct'

const Admin = () => {
  return (
 <div className="min-h-screen bg-gray-100">
 <Navbar />
<main className="flex-1">
<div className="py-6">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<Routes>
<Route path='/addproduct' element={<Addproduct />} />
<Route path='/listproduct' element={<Listproduct />} />
</Routes>
</div>
 </div>
</main>
 </div>
  )
}

export default Admin
