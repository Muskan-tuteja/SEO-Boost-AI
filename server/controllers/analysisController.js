// Analyze a URl

import Analysis from "../models/Analysis.js";

export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url)
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });

    // .validate url format
    let validUrl;
    try {
      validUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch (error) {
        return res.status(400).json({success: false, message:"Invalid URL Format"})
    }

    // Create anlaysis record with pending status
    const analysis = await Analysis.create({userId: req.userId, url: validUrl.href,status: "processing"})

    // send immediate response with analysis ID
    res.json({success: true, message: "Analysis started", analysisId: analysis._id})

    
  } catch (error) {}
};
// Get Analysis by Id
export const getAnalysis = async (req, res) => {};
// Get all  Analysis for user
export const getAnalyses = async (req, res) => {};
// deletd analysis
export const deleteAnalysis = async (req, res) => {};
