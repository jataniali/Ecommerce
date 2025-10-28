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

const app = express();
const PORT = process.env.PORT || 4000;

// Enable JSON
app.use(express.json());

// ✅ Simplified but secure CORS configuration
const allowedOrigins = [
  'https://ecommerce-frontend-4gjt.onrender.com',
  'http://localhost:5173',
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

// ✅ MongoDB Connection with Logging
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Backend');
});

// File setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads/images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: './uploads/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Serve images
app.use('/images', express.static('uploads/images'));

// ✅ Product schema
const Product = mongoose.model('Product', {
  name: { type: String, required: true },
  image: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
  category: { type: String, required: true }
});

// Add product
app.post('/addproduct', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      image: req.body.image,
      new_price: req.body.new_price,
      category: req.body.category,
      old_price: req.body.old_price
    });
    await product.save();
    console.log('Product Added Successfully');
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Error adding product' });
  }
});

// Delete product
app.post('/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.id });
    console.log('Product Deleted Successfully');
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Error deleting product' });
  }
});

// Get all products
app.get('/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});
    console.log('All products fetched successfully');
    res.send(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
});

// User schema
const users = mongoose.model('users', {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

// Signup
app.post('/signup', async (req, res) => {
  let check = await users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

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

// Login
app.post('/login', async (req, res) => {
  let user = await users.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, message: 'Wrong Email' });

  const passwordMatch = req.body.password === user.password;
  if (!passwordMatch)
    return res.json({ success: false, message: 'Wrong Password' });

  const data = { user: { id: user.id } };
  const token = jwt.sign(data, process.env.JWT_SECRET || 'fallback_secret');
  res.json({ success: true, token });
});

// Fetch user middleware
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

// Add to cart
app.post('/addtocart', fetchuser, async (req, res) => {
  try {
    const userData = await users.findById(req.user.id);
    if (!userData) return res.status(404).json({ success: false, message: 'User not found' });

    const itemId = String(req.body.itemId);
    userData.cartData[itemId] = (userData.cartData[itemId] || 0) + 1;

    await users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error('Error in /addtocart:', error);
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
});

// Remove from cart
app.post('/removefromcart', fetchuser, async (req, res) => {
  try {
    const userData = await users.findById(req.user.id);
    if (!userData) return res.status(404).json({ success: false, message: 'User not found' });

    const itemId = String(req.body.itemId);
    if (userData.cartData[itemId] > 0) userData.cartData[itemId] -= 1;

    await users.findByIdAndUpdate(req.user.id, { cartData: userData.cartData });
    res.json({ success: true, cartData: userData.cartData });
  } catch (error) {
    console.error('Error in /removefromcart:', error);
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
});

// Get cart data
app.post('/getcart', fetchuser, async (req, res) => {
  console.log('get cart');
  let userData = await users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// New collections
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollections = products.slice(1).slice(-8);
  console.log('New Collections fetched successfully');
  res.send(newcollections);
});

// Popular
app.get('/popular', async (req, res) => {
  let products = await Product.find({});
  let popular = products.slice(1).slice(-8);
  console.log('Popular Products fetched successfully');
  res.send(popular);
});

// Upload image
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  }
  return `http://localhost:${PORT}`;
};

app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: 0, message: 'No file uploaded' });

  const baseUrl = getBaseUrl(req);
  const imageUrl = `${baseUrl}/images/${req.file.filename}`;

  res.json({ success: 1, image_url: imageUrl, message: 'Image uploaded successfully' });
});

// ✅ Serve frontend build
const frontendPath = path.join(__dirname, '../../frontend/dist');
const indexPath = path.join(frontendPath, 'index.html');

const apiRoutes = [
  '/api',
  '/auth',
  '/upload',
  '/images',
  '/allproducts',
  '/newcollections',
  '/popular',
  '/addtocart',
  '/removefromcart',
  '/getcart',
  '/signup',
  '/login'
];

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  app.get('*', (req, res, next) => {
    if (apiRoutes.some((route) => req.path.startsWith(route))) return next();

    const hasExtension = ['.js', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico']
      .some((ext) => req.path.endsWith(ext));
    if (hasExtension) return next();

    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    res.status(404).send('Frontend build not found. Please build your frontend.');
  });
} else {
  console.warn('⚠️ Frontend build not found at:', frontendPath);
}

// ✅ Start server
app.listen(PORT, (error) => {
  if (!error) {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  } else {
    console.log(' Server start error:', error);
  }
});
