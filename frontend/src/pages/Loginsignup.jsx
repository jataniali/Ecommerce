import React from 'react'
import { useState } from 'react'

const Loginsignup = () => {

const[state,setState]=useState("Login")
const[formdata,setFormdata]=useState({
username:"",
email:"",
password:""
})
const changehandler=(e)=>{
setFormdata({...formdata,[e.target.name]:e.target.value})
}
const login =async()=>{
console.log("login",formdata)
  let response= await fetch("http://localhost:4000/login",{
method:"POST",
headers:{
Accept:"application/json",
"Content-Type":"application/json"
},
body:JSON.stringify(formdata)
  })
 let data = await response.json();
 console.log(data);
  if(data.success){
localStorage.setItem("token", data.token);
  window.location.replace("/")
  }
  else{
  alert(data.message)
  }
}
  const signup= async()=>{
  console.log("signup",formdata)
  let response= await fetch("http://localhost:4000/signup",{
method:"POST",
headers:{
Accept:"application/json",
"Content-Type":"application/json"
},
body:JSON.stringify(formdata)
  })
 let data = await response.json();
 console.log(data);
  if(data.success){
localStorage.setItem("token", data.token);
  window.location.replace("/")
  }
  else{
  alert(data.message)
  }
  }
  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 pt-24">
<div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
        {/* Header */}
<div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{state}</h1>
          <p className="text-gray-600">Create your account to get started</p>
 </div>

  {/* Form */}
<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
  
    {/* Name Input */}
<div className="space-y-2">
<label className="text-sm font-medium text-gray-700 block">
Your Name
</label>
{state==="signup"? <input name='username' value={formdata.username}
onChange={changehandler}
type="text"
placeholder="Enter your full name"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2
 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none
  text-gray-700 placeholder-gray-400"
/>:<></>}

</div>

    {/* Email Input */}
<div className="space-y-2">
<label className="text-sm font-medium text-gray-700 block">
Email Address
</label>
<input
name='email' value={formdata.email} onChange={changehandler}
type="email"
placeholder="Enter your email"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2
 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none
  text-gray-700 placeholder-gray-400"
 />
</div>

   {/* Password Input */}
<div className="space-y-2">
<label className="text-sm font-medium text-gray-700 block">
  Password
</label>
<input
name='password' value={formdata.password} onChange={changehandler}
type="password"
placeholder="Create a password"
className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none text-gray-700 placeholder-gray-400"
 />
</div>

   {/* Continue Button */}
<button onClick={()=>{state==='Login'?login():signup()}}
 type="button"
className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 
px-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transform
 hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
Continue
</button>

          {/* Login Link */}
<div className="text-center">
{state==="signup"?<p className="text-gray-600">
Already have an account?{' '}
<span onClick={()=>setState("Login")}
className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium 
hover:underline transition-colors duration-200">
Login here
</span>
 </p>:  <p className="text-gray-600">
Create an account?{' '}
<span onClick={()=>setState("signup")}
className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium 
hover:underline transition-colors duration-200">
Click here
</span>
 </p>}

</div>

  {/* Terms and Conditions */}
<div className="flex items-start space-x-3 pt-4">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              className="mt-1 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
              By continuing, I agree to the{' '}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
                terms of use
              </span>{' '}
              and{' '}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium">
                privacy policy
              </span>
            </label>
 </div>
</form>
</div>
</div>
  )
}

export default Loginsignup
