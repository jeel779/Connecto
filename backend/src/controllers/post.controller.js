import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Notification } from "../models/notification.model.js";

//get all the posts
//get following people posts
//get all the comments to that post

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        const imagePath = req.file?.path;
        if (!text && !imagePath) {
            return res.status(401).json({ message: "post must have iamge and text" })
        }
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });
        let imageUrl;
        if (imagePath) {
            console.log("profile image path", imagePath)
            const uploadedResponse = await uploadOnCloudinary(imagePath);
            imageUrl = uploadedResponse.secure_url;
        }
        const newPost = new Post({
            user: userId,
            text,
            image: imageUrl
        })
        await newPost.save()
        return res.status(200).json({ message: "post created successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(401).json({ message: "post not found" })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You are not authorized to delete this post" });
        }
        if (post.image) {
            const imageId = post.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }
        await Post.findByIdAndDelete(id);
        return res.status(200).json({ message: "post deleted successfully" })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(401).json({ message: "post not found" })
        }
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });
        post.comments.push({
            text,
            user: userId
        })
        await post.save()
        return res.status(200).json({
            message: "Comment added",
            comments: post.comments
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const likeOnPost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(401).json({ message: "post not found" })
        }
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });

        //fist check if user alreadyy liked or not 
        //if yes then remove like from post.likes and also user.likedPost remove 
        //if no so push that user id in post.likes and also user.likedPost  
        
        const userLikedPost=post.likes.includes(userId)
        if(userLikedPost){
          
        }else{
            await Post.likes.push(userId)
            await User.likedPost.push(userId)
            const newNotification=new Notification({
                
            })
        }

        post.likes.push(userId)
        await post.save()
        return res.status(200).json({
            message: "Like added",
            likesCount: post.likes.length
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}