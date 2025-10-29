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

// ✅ CORS setup
const allowedOrigins = [
  'https://ecommerce-frontend-4gjt.onrender.com',
  'https://ecommerce-admin-hnzh.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://localhost:4000',
  'https://ecommerce-backend-7lkk.onrender.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('Blocked CORS request from:', origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Auth-Token'
    ]
  })
);

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

// ✅ Fetch user middleware
const fetchuser = async (req, res, next) => {
  const token = req.header('token');
  if (!token) return res.status(401).send({ error: 'Please authenticate using a valid token' });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate using a valid token' });
  }
};

// ✅ Add to Cart
app.post('/addtocart', fetchuser, async (req, res) => {
  try {
    const userData = await users.findById(req.user.id);
    const itemId = String(req.body.itemId);
    userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;
    await users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error('❌ Error in /addtocart:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
});

// ✅ Remove from Cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  try {
    const userData = await users.findById(req.user.id);
    const itemId = String(req.body.itemId);
    if (userData.cartData[itemId] > 0) userData.cartData[itemId] -= 1;
    await users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error(' Error in /removefromcart:', error);
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
});

// ✅ Get Cart Data
app.post('/getcart', fetchuser, async (req, res) => {
  let userData = await users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// ✅ New Collections
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollections = products.slice(1).slice(-8);
  res.send(newcollections);
});

// ✅ Popular Products
app.get('/popular', async (req, res) => {
  let products = await Product.find({});
  let popular = products.slice(1).slice(-8);
  res.send(popular);
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
