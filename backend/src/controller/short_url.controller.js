import { ShortUrl } from "../models/shorturl.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {nanoid} from "nanoid";


 const createShortUrl = asyncHandler(async (req,res) => {
    const data = req.body;
    const userId = req.user ? req.user._id : null;
    // Check if shortUrl already exists
    const fullUrl = data.fullUrl;
    if (!fullUrl) {
        throw new ApiError(400, "Full URL is required");
    }

    let  shortUrl;

    //create a custom slug

    if(data.slug && data.slug.trim() !== ""){
        shortUrl = data.slug.trim();
        const exist = await ShortUrl.findOne({ shortUrl  });
        if(exist){
            throw new ApiError(400, "Custom slug is already in use. Please choose another one.");
        }
    }else{
        shortUrl = nanoid(8);
    }
    // Create and save new ShortUrl document
    const newShortUrl = new ShortUrl({
        fullUrl,
        shortUrl : process.env.CUSTOM_URL_ENDPOINT + shortUrl,
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
   const id = process.env.CUSTOM_URL_ENDPOINT+req.params.id;
   console.log(id)
   // Atomically increment clicks and return the updated doc
   const shortUrlDoc = await ShortUrl.findByShortUrlAndIncrement(id);
   console.log(shortUrlDoc)
   if (!shortUrlDoc) {
       throw new ApiError(404, "Short URL not found");
   }
   return res.redirect(shortUrlDoc.fullUrl);
});


//get all urls for a user

const getAllShortUrls = asyncHandler(async (req, res) => {
    const userId = req.user ? req.user._id : null;
    const shortUrls = await ShortUrl.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({
        success: true,
        data: shortUrls
    });
});

export { createShortUrl, getShortUrl, getAllShortUrls }


