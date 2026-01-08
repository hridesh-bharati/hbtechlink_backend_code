import User from "../models/User.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

// SIGNUP
export const signup = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    let avatar = "";
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      try {
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
        console.log("File size (base64):", fileBase64.length);
        
        // Cloudinary upload with error handling
        const result = await cloudinary.uploader.upload(fileBase64, {
          folder: "profiles",
          resource_type: "image",
          transformation: [{ width: 400, height: 400, crop: "limit" }],
        });
        
        avatar = result.secure_url;
        console.log("Cloudinary success! URL:", avatar);
      } catch (cloudinaryErr) {
        console.error("Cloudinary upload failed:", {
          message: cloudinaryErr.message,
          error: cloudinaryErr
        });
        // Continue WITHOUT image - don't fail signup
        avatar = ""; // Default empty
      }
    }

    // User create with or without image
    const user = await User.create({ 
      name, 
      email, 
      password, 
      avatar 
    });
    
    console.log("User created:", user._id);
    
    res.status(201).json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }, 
      token: generateToken(user._id) 
    });
    
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ 
      message: "Server error",
      error: err.message 
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ user, token: generateToken(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// VERIFY
export const verify = async (req, res) => {
  res.json({ user: req.user });
};
