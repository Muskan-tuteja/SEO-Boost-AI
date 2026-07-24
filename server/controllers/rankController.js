//  add a keyword to track
import Keyword from "../models/Keyword.js";
import { keywordTracking } from "../services/KeywordTrackingService.js";
export const addKeywordToTrack = async (req,res) => {
  try {
    const { keyword, url, domain } = req.body;

    if (!keyword || !url) return res.status(400).json({success: false, message: "Keyword and Url are required"}) 
  

        // Extract domain from URL

        let domain;
        try{
            const urlObj = new URL(url.startWith("http")? url: `https://${url}`)
            domain= urlObj.hostname.replace("www.", "")
        }catch{
            return res.status(400).json({success: false, message: "Invalid URL"})


        }
        // Check if already tracking this keyword + domain

        const existingKeyword = await Keyword.findOne({ userId: req.userId, keyword: keyword.toLowerCase().trim(), domain });
        if (existingKeyword) {
            return res.status(400).json({success: false, message: "Already tracking this keyword for the given domain"});
        }

        // Create new keyword entry
        const tracking= await KeywordTracking.create({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startWith("http")? url: `https://${url}`,
            domain,
            status: "checking",
        });
     res.status(201).json({ success: true, message: "Keyword added to tracking" , tracking: trackingKeyword});
     keywordTracking(tracking)
    } catch (error) {
        console.error("Error adding keyword to track:", error);
       if(error.code === 11000) return res.status(400).json({success: false, message: "Already tracking this keyword"})

        res.status(500).json({success: false, message: "server error"})
    }
};
// get all keywords for a user
export const getKeywords = async (req,res) => {
    try {
        const keyword = await KeywordTracking.find({userId: req.userId}).sort({createdAt: -1 }).select("-rankHistory")
        res.json({success: true, keyword})
    } catch (error) {
        console.error("Error fetching all keywords:", error.message);
         res.status(500).json({success: false, message: "server error"})
    }
};

// Get single keyword with full history
export const getKeyword = async (req,res) => {
     try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "keyword tracking not found"})
        res.json({success: true, keyword})
    } catch (error) {
        console.error("Get Keyord error :", error.message);
         res.status(500).json({success: false, message: "server error"})
    }
}

// Manually refresh a keyword's rank
export const refreshKeywordRank = async (req,res) => {
    try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "keyword tracking not found"})
            tracking.status = "checking "
        await tracking .save()
        res.json({success: true, message: "Rank check started"})

        keywordTracking(tracking)
    } catch (error) {
        console.error("Error refreshing keyword rank:", error.message);
         res.status(500).json({success: false, message: "server error"})
    }   
}

// Delete a keyword from tracking
export const deleteKeyword = async (req,res) => {
    try {
        const tracking = await KeywordTracking.findByIdAndDelete({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "keyword tracking not found"})
        res.json({success: true, message: "Keyword Tracking deleted"})
 
    } catch (error) {
        console.error("Error deleting keyword:", error);
      res.status(500).json({success: false, message: "server error"})
    }   
}

// Toggle tracking active/inactive for a keyword
export const toggleKeywordTracking = async (req,res) => {
    try {
        const tracking = await KeywordTracking.findOne({_id: req.params.id, userId: req.userId})
        if(!tracking) return res.status(404).json({success: false, message: "keyword tracking not found"})

            tracking.active = !tracking.active
            await tracking.save()
        res.json({success: true, tracking})
  
    } catch (error) {
        console.error("Error toggling keyword tracking:", error);
         res.status(500).json({success: false, message: "server error"})
    }   
}