import React, { useState } from 'react'

const Description = () => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('description')}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === 'description'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 ${
              activeTab === 'reviews'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Reviews (122)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'description' && (
            <div className="space-y-4 sm:space-y-6 text-gray-700 leading-relaxed">
              <p className="text-sm sm:text-base">
                Welcome to Shoppers, your ultimate destination for stylish and affordable fashion.
                We believe that looking good shouldn't cost a fortune — that's why we bring you a wide
                collection of trendy shirts, jeans, dresses, shoes,
                and more to suit every style and occasion. Whether you're dressing up for a night out,
                keeping it casual, or refreshing your wardrobe, we've got something just for you.
              </p>
              <p className="text-sm sm:text-base">
                Our goal is to make online shopping easy, fun, and reliable. Every product is carefully
                selected for quality, comfort, and style — ensuring you always look and feel your best.
                Explore our latest collections, enjoy secure shopping, and get your favorite fashion pieces
                delivered right to your doorstep.
              </p>
              <p className="text-sm sm:text-base">
                We are committed to offering our customers a seamless shopping experience,
                exceptional customer service, and the confidence that comes from wearing something truly
                special. Fashion isn't just about what you wear — it's about how it makes you feel,
                and we're here to help you
                feel amazing every day.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">Reviews section coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Description
