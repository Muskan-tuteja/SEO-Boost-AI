import mongoose from "mongoose";

const rankHistorySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  position: { type: Number, default: null },
  page: { type: Number, default: null },
  title: { type: String, default: "" },
  snippet: { type: String, default: "" },
},{_id: false});


const competitorSchema = new mongoose.Schema({
    position: { type: Number, required: true },
    url: { type: String, required: true },
    title: { type: String, default: "" },
    snippet: { type: String, default: "" },
  domain: { type: String, required: true },
},{_id: false});

const keywordTrackingSchema = new mongoose.Schema({
  keyword: { type: String, required: true,trim: true, lowercase: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  url: { type: String, required: true, trim: true, },
  domain: { type: String, required: true, },
  currentPosition: { type: Number, default: null },
  currentPage: { type: Number, default: null },
  bestPosition: { type: Number, default: null },
  positionChange: { type: Number, default: 0 },
  rankHistory: [rankHistorySchema],
  competitors: [competitorSchema],
  active: { type: Boolean, default: true },
  lastChecked: { type: Date, default: null },
  status: { type: String, enum: ["pending", "checked", "completed","failed"], default: "pending" },
}, { timestamps: true });  


keywordTrackingSchema.index({ keyword: 1, userId: 1, domain: 1 }, { unique: true });

const KeywordTracking = mongoose.model("KeywordTracking", keywordTrackingSchema);

export default KeywordTracking;