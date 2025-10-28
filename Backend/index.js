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
    'user-agent': req.headers['user-agent']
  });
  next();
});

// Configure CORS with specific options
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  'https://ecommerce-frontend-4gjt.onrender.com',
  'https://ecommerce-backend-7lkk.onrender.com'
];

// CORS middleware function
const corsMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Check if the origin is in the allowed list or if it's a direct API call
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      console.log('Handling preflight request for:', req.originalUrl);
      return res.status(200).end();
    }
  } else {
    console.log('CORS blocked for origin:', origin);
    return res.status(403).json({ error: 'Not allowed by CORS' });
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

// Serve static files from uploads directory with proper caching headers
app.use('/images', express.static(uploadsDir, {
  etag: true,
  lastModified: true,
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    // Cache images for 1 year
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Set proper content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
  }
}));

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
    if (req.path.includes('.') && !req.path.endsWith('/')) {
      return next();
    }
    
    console.log(`Serving index.html for client-side route: ${req.path}`);
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error sending index.html:', err);
        res.status(500).send('Error loading the application');
      }
    });
  });
  
  // Handle 404 for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });
  
} else {
  console.warn('Frontend build not found at:', frontendPath);
  
  // In development, serve a helpful message
  app.get('*', (req, res) => {
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