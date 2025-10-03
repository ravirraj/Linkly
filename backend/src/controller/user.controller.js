import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper to generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens");
  }
};

// Set refresh token cookie (works in dev & prod)
const setRefreshCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // must be true for sameSite none
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw new ApiError(409, "Username or email already in use");

  const newUser = new User({ username, email, password });
  await newUser.save();

  const tokens = await generateAccessAndRefreshTokens(newUser._id);
  setRefreshCookie(res, tokens.refreshToken);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    accessToken: tokens.accessToken,
    data: {
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    },
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid username or password");
  }

  const tokens = await generateAccessAndRefreshTokens(user._id);
  setRefreshCookie(res, tokens.refreshToken);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken: tokens.accessToken,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  });
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new ApiError(400, "No refresh token provided");

  const user = await User.findOne({ refreshToken });
  if (!user) throw new ApiError(400, "Invalid refresh token");

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json(new ApiResponse(true, "Logged out successfully"));
});

// Refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new ApiError(401, "No refresh token provided");

  const user = await User.findOne({ refreshToken });
  if (!user) throw new ApiError(403, "Invalid refresh token");

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  setRefreshCookie(res, newRefreshToken);

  return res.json({ success: true, accessToken });
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
