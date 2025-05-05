const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

// Default Route
app.get('/', (req, res) => {
  res.send("Server Running!");
});

// Start Server
app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on", process.env.PORT);
});
