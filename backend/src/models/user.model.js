import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength:6,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default:[]
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default:[]
        }
    ],
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "notification",
            default:[]
        }
    ],
    likedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post",
            default:[]
        }
    ],  
    profileImage:{
        type:String,
    },
    coverImage:{
        type:String,
    },
    bio: {
        type: String,
        default:""
    },
    link: {
        type: String,
        default:""
    }
}, { timestamps: true }
)
export const User = mongoose.model("user", userSchema)
