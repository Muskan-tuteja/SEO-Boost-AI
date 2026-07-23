import express from "express";
import { login,registerUser } from "../controllers/authController.js";
import auth from "../middleware/auth.js";


const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", login);
authRoutes.get('/user', auth,getUser);
export default authRoutes;