import jwt from "jsonwebtoken";
import User from "../src/models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {

        // In order to be able to get the token from the cookie, we need to use cookie-parser
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" })
        }

        // The token basically contains som information - in this case, it's the user ID because that's what we encoded
        // To decode the token, we use the same secret key used while encoding
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - No Token Found" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User Not Found!" });
        }

        // If user exists and is authenticated, add user to request
        req.user = user;

        // Call next function
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}