import Keyword from "../models/KeywordTracking.js";
import { keywordTracking } from "../services/KeywordTrackingService.js";

// Add a keyword to track
export const addKeywordToTrack = async (req, res) => {
  try {
    const { keyword, url } = req.body;

    if (!keyword || !url) {
      return res.status(400).json({
        success: false,
        message: "Keyword and URL are required",
      });
    }

    let domain;

    try {
      const urlObj = new URL(
        url.startsWith("http") ? url : `https://${url}`
      );
      domain = urlObj.hostname.replace("www.", "");
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL",
      });
    }

    const existingKeyword = await Keyword.findOne({
      userId: req.user.id,
      keyword: keyword.toLowerCase().trim(),
      domain,
    });

    if (existingKeyword) {
      return res.status(400).json({
        success: false,
        message: "Already tracking this keyword for this domain",
      });
    }

    const tracking = await Keyword.create({
      userId: req.user.id,
      keyword: keyword.toLowerCase().trim(),
      url: url.startsWith("http") ? url : `https://${url}`,
      domain,
      status: "checking",
    });

    res.status(201).json({
      success: true,
      message: "Keyword added successfully",
      tracking,
    });

    keywordTracking(tracking);
  } catch (error) {
    console.error("Add keyword error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Keyword already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all keywords
export const getKeywords = async (req, res) => {
  try {
    const keywords = await Keyword.find({
      userId: req.user.id,
    })
      .sort({ createdAt: -1 })
      .select("-rankHistory");

    res.json({
      success: true,
      keywords,
    });
  } catch (error) {
    console.error("Get keywords error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get single keyword
export const getKeyword = async (req, res) => {
  try {
    const tracking = await Keyword.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    res.json({
      success: true,
      tracking,
    });
  } catch (error) {
    console.error("Get keyword error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Refresh keyword rank
export const refreshKeywordRank = async (req, res) => {
  try {
    const tracking = await Keyword.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    tracking.status = "checking";
    await tracking.save();

    res.json({
      success: true,
      message: "Rank check started",
    });

    keywordTracking(tracking);
  } catch (error) {
    console.error("Refresh rank error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete keyword
export const deleteKeyword = async (req, res) => {
  try {
    const tracking = await Keyword.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    res.json({
      success: true,
      message: "Keyword deleted successfully",
    });
  } catch (error) {
    console.error("Delete keyword error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Toggle tracking
export const toggleKeywordTracking = async (req, res) => {
  try {
    const tracking = await Keyword.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!tracking) {
      return res.status(404).json({
        success: false,
        message: "Keyword not found",
      });
    }

    tracking.active = !tracking.active;
    await tracking.save();

    res.json({
      success: true,
      tracking,
    });
  } catch (error) {
    console.error("Toggle tracking error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};