// Register user

export const register = async (req, res) => {
    try{
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
     
}