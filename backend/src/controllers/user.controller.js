import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js"
import { Notification } from "../models/notification.model.js";
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
      return res.status(200).json({
         message: "login successful",
         user: {
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            followers: user.followers,
            following: user.following,
         }
      })
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }

}
export const getSuggestedUsers = async (req, res) => {
   try {
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ message: "User not found" });
      const following = user.following
      const suggestedUsers = await User.find({ _id: { $nin: [...following, userId] } }).select("-password")
      return res.status(200).json(suggestedUsers)
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
      const { fullName, username, currentPassword, newPassword, bio, link } = req.body;
      if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
         return res.status(401).json({ message: "please provide both currentPassword and newpassword" })
      }
      const userId = req.user._id
      const user = await User.findById(userId)
      if (!user) return res.status(404).json({ message: "User not found" });

      if (fullName) user.fullName = fullName;
      if (username) user.username = username;
      if (bio !== undefined) user.bio = bio;
      if (link !== undefined) user.link = link;

      if (currentPassword && newPassword) {
         const isMatch = await bcrypt.compare(currentPassword, user.password)
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
      if (error.code === 11000) {
         const field = Object.keys(error.keyValue)[0];
         return res.status(400).json({ error: `${field} already exists. Please choose another.` });
      }
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
            const publicId = user.coverImage.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
         }
         const uploadedResponse = await uploadOnCloudinary(coverImageLocalPath);
         user.coverImage = uploadedResponse.secure_url;
         await user.save({ validateBeforeSave: false })
         return res.status(200).json({ message: "coverimage updated successfully" })
      } else {
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
            // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/folder/zmxorcxexpdbh8r0bkjb.png
            const publicId = user.profileImage.split("/").slice(-2).join("/").split(".")[0];
            await cloudinary.uploader.destroy(publicId);
         }
         const uploadedResponse = await uploadOnCloudinary(profileImageLocalPath);
         user.profileImage = uploadedResponse.secure_url;
         await user.save({ validateBeforeSave: false })
         return res.status(200).json({ message: "profileImage updated successfully" })
      } else {
         return res.status(400).json({ message: "Profile image is required" })
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}
export const followAndUnfollowUser = async (req, res) => {  //testing baki che
   try {
      const { id } = req.params;
      const curruntUser = await User.findById(req.user._id)
      if (!curruntUser) {
         return res.status(404).json({ message: "User not found" });
      }
      const anotherUser = await User.findById(id)
      if (!anotherUser) {
         return res.status(404).json({ message: "following user not found" });
      }
      if (id === req.user._id.toString()) {
         return res.status(400).json({ error: "You can't follow/unfollow yourself" });
      }
      const isFollowing = curruntUser.following.includes(id)
      if (isFollowing) {
         await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
         await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

         res.status(200).json({ message: "User unfollowed successfully" });
      } else {
         await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
         await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

         const newNotification = new Notification({
            from: req.user._id,
            to: anotherUser._id,
            type: "follow",
         });

         await newNotification.save();

         return res.status(200).json({ message: "User followed successfully" });
      }
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}

export const getMe = async (req, res) => {
   try {
      const user = await User.findById(req.user._id).select("-password")
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ user })
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}

export const getUserProfile = async (req, res) => {
   try {
      const { username } = req.params;
      const user = await User.findOne({ username }).select("-password")
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json({ user })
   } catch (error) {
      return res.status(500).json({ error: error.message });
   }
}
