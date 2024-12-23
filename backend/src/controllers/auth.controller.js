import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../lib/cloudnary.js";

export const signupController = async (req, res) => {
  // getting user
  const { password, email, fullName } = req.body;

  //checking if all fields are provided
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // checking password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }
    //getting and checking if user exits in db
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    //generate token and save user
    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();
       res.status(201).json({
        message: "User created successfully",
        user: {
          email: newUser.email,
          fullName: newUser.fullName,
          token: token,
        },
      });
    } else {
       res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginController =async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });

  console.log("logged out");
  return res.status(200).json({ message: "User logged out successfully" });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { profilePic } = req.body;
  const userId = req.user._id;
  try {
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResult.secure_url },
      { new: true }
    );

    console.log(updateUser);

    res.send(200).json(updateUser);
  } catch (error) {
    console.log("message", error.message);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

export const checkAuth =  (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error from checkauth", error.message);
    res.status(500).json({ message: "internal server error" });
  }
};
