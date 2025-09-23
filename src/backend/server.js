import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB conn  mongodb://127.0.0.1:27017/e-commerce
mongoose.connect(
  "mongodb+srv://omprakash:opMdu020@cluster0.txpzw.mongodb.net/e-commerce?retryWrites=true&w=majority"
)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: [] },
  ],
  mobile: { type: String },
  address: { type: String },
});
const User = mongoose.model("User", userSchema);

// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  brand: String,
  price: Number,
  stock: Number,
  rating: Number,
  description: String,
  image: String,
});
const Product = mongoose.model("Product", productSchema);

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

//  register
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hash });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json(err, { error: "Server error" });
  }
});

// login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1h" });

    res.json({ token, user }); // ✅ send user object along with token
  } catch (err) {
    res.status(500).json(err, { error: "Server error" });
  }
});

// profile get
app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    const decoded = jwt.verify(token, "secret123");
    const user = await User.findById(decoded.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json(err, { error: "Invalid token" });
  }
});

// profile update
app.patch("/api/users/update/:id", async (req, res) => {
  const { id } = req.params;
  const { mobile, address } = req.body;

  try {
    const updateFields = {};
    if (mobile) updateFields.mobile = mobile;
    if (address) updateFields.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all products
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Search products
app.get("/api/products/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json(err, { error: "Server error" });
  }
});

// get product by id
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// place new order + auto update status
app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const order = new Order({
      userId,
      productId,
      quantity,
      status: "Placed",
    });

    await order.save();

    const statuses = ["Shipped", "Nearby", "Out for Delivery", "Delivered"];
    let index = 0;

    const interval = setInterval(async () => {
      if (index < statuses.length) {
        await Order.findByIdAndUpdate(order._id, { status: statuses[index] });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10000);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all orders for logged-in user
app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("productId", "name price") // show product details
      .populate("userId", "username email"); // optional: show user info

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Toggle favorite: Add or remove a product for a user
app.post("/api/favorites/:productId", async (req, res) => {
  try {
    const { userId } = req.body;
    const { productId } = req.params;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites) user.favorites = [];

    if (user.favorites.includes(productId)) {
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.favorites.push(productId);
    }

    await user.save();

    // Return populated favorites
    const updatedUser = await User.findById(userId).populate("favorites");
    res.json({
      message: "Favorites updated",
      favorites: updatedUser.favorites,
    });
  } catch (err) {
    console.error("Favorites Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Get saved products for a user
app.get("/api/saved/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("favorites");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (err) {
    console.error("Fetch Saved Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

//  Remove a saved product explicitly
app.delete("/api/remove/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({ message: "Product removed", favorites: user.favorites });
  } catch (err) {
    console.error("Remove Saved Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000;
app.listen(5000, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
