import { ShortUrl } from "../models/shorturl.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {nanoid} from "nanoid";
 const createShortUrl = asyncHandler(async (req,res) => {
    const {fullUrl,userId} = req.body;
    const shortUrl = nanoid(8);
    // Check if shortUrl already exists
    const existing = await ShortUrl.findOne({ shortUrl });
    if (existing) {
        throw new ApiError("Short URL already exists");
    }
    // Create and save new ShortUrl document
    const newShortUrl = new ShortUrl({
        fullUrl,
        shortUrl,
        
    });
    if(userId){
        newShortUrl.user = userId;
    }
     await newShortUrl.save();

     return res.status(201).json({
        success: true,
        data: newShortUrl
     });
})


 const getShortUrl = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const shortUrlDoc = await ShortUrl.findOne({ shortUrl: id });
    if (!shortUrlDoc) {
        throw new ApiError(404 ,"Short URL not found");
    }
    return res.redirect(shortUrlDoc.fullUrl);
})


export { createShortUrl, getShortUrl }


