import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Notification } from "../models/notification.model.js";

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        if (posts.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const getAllFollowingUsersPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });
        return res.status(200).json(feedPosts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        return res.status(200).json(likedPosts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
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
        await User.updateMany(
            { likedPosts: id },
            { $pull: { likedPosts: id } }
        );
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
export const likeAndUnlikePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post) {
            return res.status(401).json({ message: "post not found" })
        }
        const userId = req.user._id;
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: "User not found" });

        const userLikedPost = post.likes.includes(userId)
        if (userLikedPost) {
            await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: id } });

            const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
            res.status(200).json(updatedLikes);
        } else {
            post.likes.push(userId)
            await User.updateOne({ _id: userId }, { $push: { likedPosts: id } })
            await post.save()

            if (post.user.toString() !== userId.toString()) {
                const newNotification = new Notification({
                    from: userId,
                    to: post.user,
                    type: "like"
                })
                await newNotification.save()
            }

            const updatedLikes = post.likes;
            res.status(200).json(updatedLikes);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
