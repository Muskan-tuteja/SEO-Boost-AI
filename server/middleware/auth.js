import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try{
  const token = req.header("Authorization")?.replace("Bearer ", "");    

    } catch (error) {
        console.error("Error in auth middleware:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }  
}