import React from 'react'
import Navbar from './components/Navbar/Navbar'
import ShopcontextProvider from '../../../frontend/src/context/ShopConext'

const App = () => {
  return (
    <ShopcontextProvider>
    <div className="min-h-screen bg-gray-100">
      <Navbar />
    </div>
    </ShopcontextProvider>
  )
}

export default App
