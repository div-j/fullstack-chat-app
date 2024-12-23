import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

export const protectedRoute = async (req, res, next) => {
try {
    
    const token = req.cookies.jwt
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

   const decode =  jwt.verify(token, process.env.JWT_SECRET_KEY)

   if (!decode) {
    return res.status(401).json({ message: 'Unauthorized invalid token' })
   }

   const user  = await User.findById(decode.userId).select("-password");

   if (!user) {
    return res.status(401).json({ message: 'Unauthorized invalid user' })
   }

   req.user = user

   next();
    
} catch (error) {
    console.log("erro in protectRoute middle ware",error.message);
    res.status(500).json({message:"internal server error"})
    
}
    
}