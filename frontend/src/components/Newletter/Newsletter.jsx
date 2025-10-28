import React from 'react';

const Newsletter = () => {
  return (
    <div className="w-full py-16 text-white px-4 bg-gradient-to-r from-teal-500 to-indigo-600">
      <div className="max-w-[1240px] mx-auto grid lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="md:text-4xl sm:text-3xl text-2xl font-bold py-2">
            Get Exclusive Offers On Your Email
          </h1>
          <p className="text-gray-100">
            Subscribe to our newsletter and stay updated with our latest offers and news.
          </p>
        </div>
        <div className="my-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full">
            <input
              className="p-3 flex w-full rounded-md text-black"
              type="email"
              placeholder="Enter Your Email"
            />
            <button className="bg-black text-white rounded-md font-medium w-[200px] ml-4 my-6 px-6 py-3 hover:bg-gray-800 transition-colors duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-100 mt-2">
            We care about your data. Read our{' '}
            <span className="text-white font-medium cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
