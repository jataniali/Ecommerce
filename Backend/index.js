import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 4000;

import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

const app=express()
app.use(express.json())

// CORS debugging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.originalUrl,
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent'],
    'accept': req.headers.accept,
    'accept-encoding': req.headers['accept-encoding']
  });
  next();
});

// Configure CORS with specific options
const allowedOrigins = [
  'https://ecommerce-frontend-4gjt.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://ecommerce-backend-7lkk.onrender.com'
];

// CORS middleware function with enhanced headers and logging
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  const requestHeaders = req.headers['access-control-request-headers'];
  
  console.log('CORS Headers Check:', {
    origin,
    method: req.method,
    url: req.originalUrl,
    requestHeaders,
    allowedOrigins
  });

  // Check if the origin is in the allowed list or if it's a direct API call
  const isAllowedOrigin = !origin || allowedOrigins.some(allowedOrigin => {
    return origin === allowedOrigin || 
           origin.replace(/^https?:\/\//, '') === allowedOrigin.replace(/^https?:\/\//, '');
  });

  if (isAllowedOrigin) {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      // Add additional headers for preflight requests if needed
      if (requestHeaders) {
        res.header('Access-Control-Allow-Headers', requestHeaders);
      }
      console.log('Preflight request:', { origin, headers: res.getHeaders() });
      return res.status(204).end();
    }
    
    console.log('Allowed CORS request:', { origin, url: req.originalUrl });
  } else {
    // For non-allowed origins, log and block
    console.warn(`Blocked request from unauthorized origin: ${origin}`, {
      url: req.originalUrl,
      method: req.method,
      allowedOrigins
    });
    
    // You can choose to block the request or allow it with limited access
    // For now, we'll allow the request but log it
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  next();
};

// Apply CORS middleware to all routes
app.use(corsMiddleware);

//database connection with mongodb 
mongoose.connect(process.env.MONGODB_URI)
//api creation

app.get('/',(req,res)=>{
res.send("Hello from Backend")
})

// image storage Engine
const storage=multer.diskStorage({
destination:"./uploads/images",
filename:(req,file,cb)=>{
return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
}
})

const upload=multer({
storage:storage
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Enhanced static file serving with better error handling and logging
app.use('/images', (req, res, next) => {
  // Log image requests for debugging
  console.log('Image request:', {
    originalUrl: req.originalUrl,
    path: req.path,
    method: req.method,
    headers: req.headers
  });
  
  // Set CORS headers for all image responses
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  // Continue to the static file serving
  next();
}, express.static('uploads/images', {
  setHeaders: (res, filePath) => {
    try {
      // Set cache headers
      const oneYear = 31536000; // 1 year in seconds
      res.setHeader('Cache-Control', `public, max-age=${oneYear}, immutable`);
      
      // Set content type based on file extension
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      
      if (mimeTypes[ext]) {
        res.setHeader('Content-Type', mimeTypes[ext]);
      } else {
        console.warn(`Unknown file extension: ${ext} for file: ${filePath}`);
      }
      
      // Log successful image serving
      console.log(`Serving image: ${filePath}`, {
        'content-type': res.getHeader('Content-Type'),
        'cache-control': res.getHeader('Cache-Control')
      });
    } catch (error) {
      console.error('Error setting image headers:', error);
    }
  },
  
  // Handle errors when serving static files
  fallthrough: false
}));

// Error handler for static files
app.use('/images', (err, req, res, next) => {
  console.error('Error serving image:', {
    error: err.message,
    url: req.originalUrl,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  // Send a default image or error response
  res.status(404).json({
    success: false,
    message: 'Image not found or error serving image',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Fallback image handler for case-insensitive matching
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const uploadsDir = path.join(__dirname, 'uploads', 'images');
  
  // First try exact match
  const exactPath = path.join(uploadsDir, imageName);
  if (fs.existsSync(exactPath)) {
    return res.sendFile(exactPath, {
      headers: {
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  }
  
  // If no exact match, try case-insensitive search
  try {
    const files = fs.readdirSync(uploadsDir);
    const foundFile = files.find(file => 
      file.toLowerCase() === imageName.toLowerCase()
    );
    
    if (foundFile) {
      return res.sendFile(path.join(uploadsDir, foundFile), {
        headers: {
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    }
    
    // If still not found, return 404 with a helpful message
    console.warn(`Image not found: ${imageName}`);
    res.status(404).json({ 
      error: 'Image not found',
      requested: imageName,
      available: files.slice(0, 10) // Show first 10 available files for debugging
    });
    
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ 
      error: 'Error serving image',
      details: error.message 
    });
  }
});

// Get the base URL based on the environment
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === 'production') {
    // For production, use the environment variable or construct from request
    return process.env.BACKEND_URL || 
           `${req.protocol}://${req.get('host')}`;
  }
  // For development, use localhost with the correct protocol
  return `http://localhost:${PORT}`;
};

// Upload endpoint
app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: 'No file uploaded'
    });
  }

  const baseUrl = getBaseUrl(req);
  const imageUrl = `${baseUrl}/images/${req.file.filename}`;
  
  res.json({
    success: 1,
    image_url: imageUrl,
    message: 'Image uploaded successfully'
  });
});

// creating schema for products
const Product=mongoose.model('Product',{
name:{type:String,required:true},
image:{type:String,required:true},
new_price:{type:Number,required:true},
old_price:{type:Number,required:true},
date:{type:Date,default:Date.now},
available:{type:Boolean,default:true},
category:{type:String,required:true}
})

app.post('/addproduct',async(req,res)=>{

try {
const product= new Product({
name:req.body.name,
image:req.body.image,
new_price:req.body.new_price,
category:req.body.category,
old_price:req.body.old_price,
})
console.log(product)
await product.save()
console.log("Product Added Successfully")
res.json({
success:true,
name:req.body.name,
})
} catch (error) {
console.error(" Error adding product:", error);
}
})

//creating Api for Deleteing a product
app.post('/removeproduct',async (req,res)=>{
try {
await Product.findOneAndDelete({_id:req.body.id})
console.log("Product Deleted Successfully")
res.json({
success:true,
name:req.body.name,
})
} catch (error) {
console.error(" Error Deleting product:", error);
}
})

//cretaingh api for getting all product
app.get('/allproducts', async (req,res)=>{
try {
 let products= await Product.find({})
 console.log('All products fetched successfully') 
 res.send(products)  
} catch (error) {
console.error(" Error fetching products:", error);
}
})

// schema for usermodel
const users=mongoose.model('users',{
name:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:true},
cartData:{type:Object,},
date: { type: Date, default: Date.now },
})
// creating endpoint for regitering the user
app.post('/signup',async(req,res)=>{
let check= await users.findOne({
email:req.body.email
})
if(check){
return res.status(400).json({
success:false,message:"User already exists"
})
}
let cart={}
for(let i=0;i<300;i++){
cart[i]=0
}
const user=new users({
name:req.body.username,
email:req.body.email,
password:req.body.password,
cartData:cart
})
await user.save()

const data={
user:{
id:user.id
}
}
const authtoken = jwt.sign(data, process.env.JWT_SECRET || 'fallback_secret')
res.json({success:true,token:authtoken})

})

// creating endpoint for userlogin
app.post('/login', async(req,res)=>{
let user= await users.findOne({email:req.body.email})
if(user){
const passwordmatch=req.body.password===user.password
if(passwordmatch){
const data={
user:{
id:user.id
}
}
const token = jwt.sign(data, process.env.JWT_SECRET || 'fallback_secret')
res.json({ 
 success: true, 
token: token 
});
}
else{
res.json({success:false,message:"Wrong Password"})
}
}
else{
res.json({success:false,message:"Wrong Email"})
}
})

//creating endpoint for new collection data
app.get('/newcollections',async(req,res)=>{
let products=await Product.find({});
let newcollections=products.slice(1).slice(-8)
console.log("New Collections fetched successfully")
res.send(newcollections)
})

//creating endpoint for popular in the market data
app.get('/popular',async(req,res)=>{
let prouducts=await Product.find({});
let popular=prouducts.slice(1).slice(-8)
console.log("Popular Products fetched successfully")
res.send(popular)
})

//creating middleware to fetch user data
const fetchuser= async(req,res,next)=>{
const token=req.header('token')
if(!token){
res.status(401).send({error:"Please authenticate using a valid token"})
}
else{
try {
const data = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') 
req.user=data.user
next()
} catch (error) {
res.status(401).send({error:"Please authenticate using a valid token"}) 
}
}
}

// creating endpoint for saving cart product data
app.post('/addtocart', fetchuser, async (req, res) => {
    try {
 // 1. Find the user
const userData = await users.findById(req.user.id);
if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
 }

// 2. Initialize cartData if it doesn't exist
if (!userData.cartData) {
            userData.cartData = {};
}

const itemId = String(req.body.itemId);  // Ensure consistent type

 // 3. Initialize the item's quantity if it doesn't exist
if (userData.cartData[itemId] === undefined) {
            userData.cartData[itemId] = 0;
}

// 4. Increment the quantity
 userData.cartData[itemId] += 1;

// 5. Save the updated user
await users.findByIdAndUpdate(
            req.user.id,
            { cartData: userData.cartData }
 );

// 6. Send back the updated cart
res.json({ 
            success: true, 
            cartData: userData.cartData 
});

    } catch (error) {
        console.error("Error in /addtocart:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error adding to cart" 
        });
    }
});

// creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchuser,async(req,res)=>{
try {
 // 1. Find the user
const userData = await users.findById(req.user.id);
if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
 }

// 2. Initialize cartData if it doesn't exist
if (!userData.cartData) {
            userData.cartData = {};
}

const itemId = String(req.body.itemId);  // Ensure consistent type

 // 3. Initialize the item's quantity if it doesn't exist
if (userData.cartData[itemId] === undefined) {
            userData.cartData[itemId] = 0;
}

// 4. decrcrement the quantity
if(userData.cartData[itemId]>0){
 userData.cartData[itemId] -= 1;
}

// 5. Save the updated user
await users.findByIdAndUpdate(
            req.user.id,
            { cartData: userData.cartData }
 );

// 6. Send back the updated cart
res.json({ 
            success: true, 
            cartData: userData.cartData 
});
} catch (error) {
        console.error("Error in /removefromcart:", error); 
        res.status(500).json({ 
            success: false, 
            message: "Error removing from cart" 
        });
}
})

// creating endpoint to get cart data
app.post('/getcart',fetchuser,async(req,res)=>{
console.log("get cart")
let userData= await users.findOne({_id:req.user.id})
res.json(userData.cartData)
})

// Serve static files from the React app
const frontendPath = path.join(__dirname, '../../frontend/dist');
const indexPath = path.join(frontendPath, 'index.html');

if (fs.existsSync(frontendPath)) {
  console.log('Serving static files from:', frontendPath);
  
  // Serve static files with proper caching
  app.use(express.static(frontendPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Cache static assets for 1 year
      if (path.endsWith('.js') || path.endsWith('.css') || path.match(/\.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));
  
  // API routes that should be handled by the server
  const apiRoutes = [
    '/api/',
    '/auth/',
    '/upload',
    '/images/',
    '/allproducts',
    '/newcollections',
    '/popular',
    '/addtocart',
    '/removefromcart',
    '/getcart',
    '/signup',
    '/login'
  ];
  
  // Serve index.html for all non-API and non-static file requests
  // This handles client-side routing for all routes including /product/:id
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (apiRoutes.some(route => req.path.startsWith(route))) {
      return next();
    }
    
    // Skip static files with extensions (like .js, .css, .jpg, etc.)
    const fileExtensions = ['.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot'];
    const hasExtension = fileExtensions.some(ext => req.path.endsWith(ext));
    
    if (hasExtension) {
      return next();
    }
    
    // For all other routes, serve index.html
    console.log(`Serving index.html for client-side route: ${req.path}`);
    
    // Check if the file exists first
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Error loading the application');
        }
      });
    } else {
      console.error('Index.html not found at:', indexPath);
      return res.status(404).send('Frontend build not found. Please build your frontend.');
    }
  });
  
  // Handle 404 for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });
  
} else {
  console.warn('Frontend build not found at:', frontendPath);
  
  // In development, serve a helpful message
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    res.status(404).send(`
      <h1>Frontend Build Not Found</h1>
      <p>Please build your frontend with 'npm run build' in the frontend directory.</p>
      <p>Current NODE_ENV: ${process.env.NODE_ENV || 'development'}</p>
      <p>Looking for frontend at: ${frontendPath}</p>
    `);
  });
}

app.listen(PORT,(error)=>{
  if(!error){
    console.log("Server is Successfully Running, and App is listening on port "+ PORT);
    console.log("NODE_ENV:", process.env.NODE_ENV || 'development');
  } else {
    console.log("Error occurred, server can't start", error);
  }
})