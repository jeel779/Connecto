import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const verifyJwt=async(req,res,next)=>{
    try {
        const token=req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            return res.status(401).json({message:"unauthorized user"})
        }
        const decodeToken=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decodeToken._id).select("-password")
        if(!user){
            return res.status(401).json({message:"invalid access token"})
        }
        req.user=user
        next()
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}