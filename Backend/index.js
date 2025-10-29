import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Middleware
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  'https://ecommerce-frontend-4gjt.onrender.com',
  'https://ecommerce-admin-hnzh.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

// CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'token');
    res.setHeader('Access-Control-Max-Age', '600');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});


// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// ✅ Basic route
app.get('/', (req, res) => {
  res.send('Hello from Backend');
});

// ✅ Configure Cloudinary
console.log('Initializing Cloudinary...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('Cloudinary configured successfully');

// ✅ Cloudinary Storage setup with better configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce-products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [
      { width: 800, crop: 'limit', quality: 'auto' },
      { fetch_format: 'auto' }
    ]
  },
  filename: function (req, file, cb) {
    cb(null, `product-${Date.now()}-${file.originalname}`);
  }
});

// Configure multer with file size limit and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('product');

// ✅ Product Schema
const Product = mongoose.model('Product', {
  name: { type: String, required: true },
  image: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  category: { type: String, required: true }
});

// ✅ Add Product
app.post('/addproduct', async (req, res) => {
  try {
    const imageUrl = req.body.image; // Cloudinary URL directly
    const product = new Product({
      name: req.body.name,
      image: imageUrl,
      new_price: req.body.new_price,
      category: req.body.category,
      old_price: req.body.old_price
    });

    await product.save();
    console.log('✅ Product Added Successfully');
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
});

// ✅ Delete Product
app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.id });
    console.log('🗑️ Product Deleted Successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// ✅ Get All Products
app.get('/allproducts', async (req, res) => {
  try {
    console.log('📦 Fetching all products...');
    let products = await Product.find({}).lean();
    
    // Ensure all products have both _id and id fields for compatibility
    const formattedProducts = products.map(product => ({
      ...product,
      id: product._id.toString(), // Ensure id is a string
      _id: product._id.toString() // Ensure _id is a string
    }));
    
    console.log(`✅ Fetched ${formattedProducts.length} products successfully`);
    res.json(formattedProducts);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching products',
      error: error.message 
    });
  }
});

// ✅ User Schema
const users = mongoose.model('users', {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

// ✅ Signup
app.post('/signup', async (req, res) => {
  let check = await users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart
  });
  await user.save();

  const data = { user: { id: user.id } };
  const authtoken = jwt.sign(data, process.env.JWT_SECRET || 'fallback_secret');
  res.json({ success: true, token: authtoken });
});

// ✅ Login
app.post('/login', async (req, res) => {
  let user = await users.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, message: 'Wrong Email' });

  const passwordMatch = req.body.password === user.password;
  if (!passwordMatch) return res.json({ success: false, message: 'Wrong Password' });

  const data = { user: { id: user.id } };
  const token = jwt.sign(data, process.env.JWT_SECRET || 'fallback_secret');
  res.json({ success: true, token });
});

// ✅ Enhanced fetch user middleware with additional checks
const fetchuser = async (req, res, next) => {
  try {
    // Check for token in both header, query, and body (for maximum compatibility)
    const token = req.header('token') || req.query.token || (req.body && req.body.token);
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required: No token provided',
        code: 'AUTH_REQUIRED'
      });
    }

    // Verify token
    const data = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Additional check for required user data
    if (!data || !data.user || !data.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token: User data missing',
        code: 'INVALID_TOKEN'
      });
    }
    
    // Verify user exists in database
    const userExists = await users.findById(data.user.id);
    if (!userExists) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Attach user to request
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please log in again.',
        code: 'INVALID_TOKEN'
      });
    }
    
    // For other errors
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      code: 'AUTH_FAILED',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Add to Cart
app.post('/addtocart', fetchuser, async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }

    const user = await users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Initialize cart if it doesn't exist
    if (!user.cartData) {
      user.cartData = {};
    }

    // Update cart
    const itemIdStr = String(itemId);
    user.cartData[itemIdStr] = (user.cartData[itemIdStr] || 0) + 1;

    await users.findByIdAndUpdate(
      req.user.id,
      { cartData: user.cartData },
      { new: true }
    );

    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error('❌ Error in /addtocart:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
});

// ✅ Remove from Cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  try {
    // Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // Validate itemId
    if (!req.body.itemId) {
      return res.status(400).json({ success: false, message: 'Item ID is required' });
    }
    
    const itemId = String(req.body.itemId);
    
    // Find user and initialize cartData if it doesn't exist
    const userData = await users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize cartData if it doesn't exist or is not an object
    if (!userData.cartData || typeof userData.cartData !== 'object') {
      userData.cartData = {};
    }
    
    // Only decrement if the item exists and quantity > 0
    if (userData.cartData[itemId] > 0) {
      userData.cartData[itemId] -= 1;
      
      // If quantity becomes zero, remove the item from cart
      if (userData.cartData[itemId] <= 0) {
        delete userData.cartData[itemId];
      }
      
      // Save the updated user data
      await users.findByIdAndUpdate(
        req.user.id,
        { cartData: userData.cartData },
        { new: true, runValidators: true }
      );
    }
    
    // Get the latest cart data
    const updatedUser = await users.findById(req.user.id);
    
    res.json({ 
      success: true, 
      cartData: updatedUser.cartData || {},
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('❌ Error in /removefromcart:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing from cart',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ✅ Get Cart Data
app.post('/getcart', fetchuser, async (req, res) => {
  try {
    // Validate user
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    // Find user and initialize cartData if it doesn't exist
    const userData = await users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize cartData if it doesn't exist or is not an object
    if (!userData.cartData || typeof userData.cartData !== 'object') {
      userData.cartData = {};
      // Save the initialized cart data
      await users.findByIdAndUpdate(
        req.user.id,
        { cartData: {} },
        { new: true, runValidators: true }
      );
    }
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json(userData.cartData || {});
  } catch (error) {
    console.error('❌ Error in /getcart:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart' });
  }
});

// ✅ New Collections
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollections = products.slice(1).slice(-8);
  res.send(newcollections);
});

// ✅ Popular Products
app.get('/popular', async (req, res) => {
  try {
    console.log('📦 Fetching popular products...');
    let products = await Product.find({ available: true }).sort({ date: -1 }).limit(8).lean();
    
    // Format products to ensure consistent ID fields
    const formattedProducts = products.map(product => ({
      ...product,
      id: product._id ? product._id.toString() : null,
      _id: product._id ? product._id.toString() : null
    }));
    
    console.log(`✅ Fetched ${formattedProducts.length} popular products`);
    res.json(formattedProducts);
  } catch (error) {
    console.error('❌ Error fetching popular products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular products',
      error: error.message
    });
  }
});

// ✅ Upload image to Cloudinary with better error handling
app.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'File upload error',
          code: err.code
        });
      } else if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ 
          success: false, 
          message: err.message || 'Error uploading file'
        });
      }

      // Check if file exists
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded or file is empty' 
        });
      }

      console.log('File uploaded to Cloudinary:', {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryUrl: req.file.path
      });
      
      // Return the Cloudinary URL
      res.json({
        success: true,
        image_url: req.file.path,
        message: 'Image uploaded successfully',
        file: {
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype
        }
      });
      
    } catch (error) {
      console.error('❌ Upload processing error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to process upload',
        error: error.message 
      });
    }
  });
});

// ✅ Serve frontend build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../../frontend/dist');
const indexPath = path.join(frontendPath, 'index.html');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/upload')) {
      return res.status(404).send('Not Found');
    }
    res.sendFile(indexPath);
  });
} else {
  console.warn('⚠️ Frontend build not found at:', frontendPath);
}

// ✅ Start Server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(` Server running on port ${PORT}`);
  } else {
    console.log(' Server start error:', error);
  }
});
