import React, { useState } from 'react'

const Addproduct = () => {

const[addimage,setAddimage]=useState(false);
const[productdetails,setProductdetails]=useState({
name:"",
image:"",
category:"women",
new_price:"",
old_price:"",
})

const imagehandler=(e)=>{
setAddimage(e.target.files[0])
}
const changehandler=(e)=>{
setProductdetails({...productdetails,[e.target.name]:e.target.value})
}

const Add_product= async (e)=>{
e.preventDefault(); // Prevent form submission
let responsedata;
let product=productdetails;

if(!addimage) {
  alert('Please select an image');
  return;
}

let formdata=new FormData();
formdata.append('product', addimage);

await fetch('http://localhost:4000/upload',{
method:'POST',
headers:{
Accept:'application/json',
},
body:formdata,
}).then((res)=>res.json()).then((data)=>{responsedata=data})

if(responsedata.success){
product.image=responsedata.image_url;
await fetch('http://localhost:4000/addproduct',{
method:'POST',
headers:{
Accept:'application/json',
'Content-Type':'application/json',
},
body:JSON.stringify(product),
}).then((res)=>res.json()).then((data)=>{
data.success?alert("Product Added Successfully"):alert("Failed to add product")
})
}
}


  return (
<div className="bg-white overflow-hidden shadow rounded-lg">
<div className="p-6">
<h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h1>
<form className="space-y-6">
<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Product Title
</label>
<input value={productdetails.name} onChange={changehandler}
type="text"
name='name'
 placeholder='Type Here'
className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
/>
</div>

 <div>
<label className="block text-sm font-medium text-gray-700 mb-2">
 Offer Price
</label>
<input value={productdetails.new_price} onChange={changehandler}
type="number"
step="0.01"
name="new_price"
placeholder="Enter price"
className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
/>
</div>

<div>
<label className="block text-sm font-medium text-gray-700 mb-2">
Price
</label>
<input value={productdetails.old_price} onChange={changehandler}
type="number"
step="0.01"
name="old_price"
placeholder="Enter price"
className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
 />
</div>

<div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
Category
</label>
<select
  name="category"
  value={productdetails.category}
  onChange={changehandler}
  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
>
  <option value="mens">Men's Clothing</option>
  <option value="women">Women's Clothing</option>
  <option value="electronics">Electronics</option>
</select>
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Product Image
  </label>
  <div className="mb-3">
    {addimage ? (
      <div className="flex justify-center">
        <img
          src={URL.createObjectURL(addimage)}
          alt="Product Preview"
          className="max-w-full max-h-48 object-contain rounded-lg border-2 border-gray-200 shadow-sm"
        />
      </div>
    ) : (
      <div className="flex justify-center items-center h-48 bg-gray-100 border-2 border-gray-300 border-dashed rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">No image selected</p>
        </div>
      </div>
    )}
  </div>
  <input
    onChange={imagehandler}
    type="file"
    accept="image/*"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
  />
</div>

<div className="flex justify-end space-x-3">
<button
 type="button"
className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
 >
Cancel
</button>
<button onClick={Add_product}
type="submit"
className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
>
Add Product
</button>
</div>
</form>
</div>
</div>
  )
}

export default Addproduct
