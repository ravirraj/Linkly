import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";





const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        console.log(user)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}
// User registration
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "Username or email already in use");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    // yaha pe tokens banate hai
    const tokens = await generateAccessAndRefereshTokens(newUser._id);

    // set refreshToken cookie
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        accessToken: tokens.accessToken,
        data: {
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        }
    });
});


// User login
const loginUser = asyncHandler(async (req, res) => {
    const { username , password , email} = req.body;
    const user = await User.findOne({ $or:[{ email }, { username }] });
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid username or password");
    }
    
    
    // Generate tokens

    const tokens = await generateAccessAndRefereshTokens(user._id)

    //set refresh token in db





    // Set refresh token in HTTP-only cookie
    

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:"/",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days

    }

    res.cookie("refreshToken", tokens.refreshToken, options)

    return res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken: tokens.accessToken,
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        }
    });
});


//user logout   
const logoutUser = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(400, "No refresh token provided");
    }
    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new ApiError(400, "Invalid refresh token");
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    return res.status(200).json(new ApiResponse(true, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ApiError(401, "No refresh token provided");
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new ApiError(403, "Invalid refresh token");
    }

    // generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefereshTokens(user._id);

    // set new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
        success: true,
        accessToken,
    });
});


export { registerUser, loginUser, logoutUser, refreshAccessToken };