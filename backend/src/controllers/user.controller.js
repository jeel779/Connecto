import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

export const registerUser = async (req, res) => {
   try {
      const { email, username, fullName, password } = req.body
      if (!email || !username || !fullName || !password) {
         return res.status(401).json({ message: "enter all the credentials" })
      }
      const existedUser = await User.findOne({ $or: [{ username }, { email }] })
      if (existedUser) {
         return res.status(401).json({ message: "user already exist with this email or username " })
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds)
      const user = await User.create({
         email,
         username,
         fullName,
         password: hashedPassword
      })
      const createdUser = await User.findById(user._id).select("-password")
      return res.status(200).json({ message: "user created successfully", createdUser })
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}
export const loginUser = async (req, res) => {
   try {
      const { username, password } = req.body;
      if (!username || !password) {
         return res.status(401).json({ message: "enter all the credentials" })
      }
      const user = await User.findOne({ username })
      if (!user) {
         return res.status(401).json({ message: "user not exist" })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
         return res.status(401).json({ message: "invalid credentials" })
      }
      const payload = {
         _id: user._id
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
      res.cookie("token", token, {
         httpOnly: true,
         secure: true,
      })
      return res.status(200).json({ message: "login successful" })
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }

}
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
export const updateProfile = async (req, res) => {
   try {
      const { fullName, username, curruntPassword, newPassword, bio, link } = req.body;
      if ((!curruntPassword && newPassword) || (!newPassword && curruntPassword)) {
         return res.status(401).json({ message: "please provide both curruntpassword and newpassword" })
      }
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ message: "User not found" });

      if (fullName) user.fullName = fullName;
      if (username) user.username = username;
      if (bio !== undefined) user.bio = bio;
      if (link !== undefined) user.link = link;

      if (curruntPassword && newPassword) {
         const isMatch = await bcrypt.compare(curruntPassword, user.password)
         if (!isMatch) {
            return res.status(401).json({ message: "invalid credentials" })
         }
         const saltRounds = 10;
         const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
         user.password = hashedPassword
      }
      await user.save({ validateBeforeSave: false })
      return res.status(200).json({ message: "profile updated successfully" })
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}
export const updateCoverImage = async (req, res) => {
   try {
      const coverImageLocalPath = req.file?.path;
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ message: "User not found" });
      if (coverImageLocalPath) {
         console.log("cover image path", coverImageLocalPath)
         if (user.coverImage) {
            await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
         }
         const uploadedResponse = await uploadOnCloudinary(coverImageLocalPath);
         user.coverImage = uploadedResponse.secure_url;
         await user.save({ validateBeforeSave: false })
         return res.status(200).json({ message: "coverimage updated successfully" })
      }else{
          return res.status(400).json({ message: "cover image is required" })
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }

}
export const updateProfileImage = async (req, res) => {
   try {
      const profileImageLocalPath = req.file?.path;
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ message: "User not found" });
      if (profileImageLocalPath) {
         console.log("profile image path", profileImageLocalPath)
         if (user.profileImage) {
            // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
            await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
         }
         const uploadedResponse = await uploadOnCloudinary(profileImageLocalPath);
         user.profileImage = uploadedResponse.secure_url;
         await user.save({ validateBeforeSave: false })
         return res.status(200).json({ message: "profileImage updated successfully" })
      }else{
          return res.status(400).json({ message: "Profile image is required" })
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}

export const getMe=async(req,res)=>{
   try {
      const user=await User.findById(req.user._id).select("-password")
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({user})
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}

export const getUserProfile=async(req,res)=>{   
   try {
      const { username }=req.params;
      const user=await User.findOne({username}).select("-password")
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({user})
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}
