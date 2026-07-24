//  add a keyword to track
import Keyword from "../models/Keyword.js";
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
        const trackingKeyword = await Keyword.create({
            userId: req.userId,
            keyword: keyword.toLowerCase().trim(),
            url: url.startWith("http")? url: `https://${url}`,
            domain,
            status: "checking",
        });
     res.status(201).json({ success: true, message: "Keyword added to tracking" , tracking: trackingKeyword});
     
    } catch (error) {
        console.error("Error adding keyword to track:", error);
        throw error;
    }
};
// get all keywords for a user
export const getKeywords = async (token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/getAllKeywords`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all keywords:", error);
        throw error;
    }
};

// Get single keyword with full history
export const getKeyword = async (keywordId: string, token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/getKeyword/${keywordId}`, {      
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching keyword:", error);
        throw error;
    }   
}

// Manually refresh a keyword's rank
export const refreshKeywordRank = async (keywordId: string, token: string) => {
    try {   
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/refreshKeyword/${keywordId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error refreshing keyword rank:", error);
        throw error;
    }   
}

// Delete a keyword from tracking
export const deleteKeyword = async (keywordId: string, token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/deleteKeyword/${keywordId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting keyword:", error);
        throw error;
    }   
}

// Toggle tracking active/inactive for a keyword
export const toggleKeywordTracking = async (keywordId: string, token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/toggleKeyword/${keywordId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error toggling keyword tracking:", error);
        throw error;
    }   
}