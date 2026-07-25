import express from "express"
import auth from "../middleware/auth.js"
import { addKeywordToTrack, deleteKeyword, getKeyword, getKeywords, refreshKeywordRank, toggleKeywordTracking } from "../controllers/rankController.js"

const rankRoutes = express.Router()

rankRoutes.post('/add', auth, addKeywordToTrack)
rankRoutes.get("/list", auth, getKeywords); // all keywords
rankRoutes.get("/:id", auth, getKeyword);   // single keyword
rankRoutes.post("/:id/refresh", auth, refreshKeywordRank);
rankRoutes.put('/:id/toggle', auth, toggleKeywordTracking)
rankRoutes.delete('/:id', auth, deleteKeyword)

export default rankRoutes