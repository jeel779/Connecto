import mongoose from "mongoose";
const notificiationSchema=new mongoose.Schema({
    to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    type:{
        type:String,
        enum:["like","follow"]
    }
},{ timestamps: true })
export const Notification=mongoose.model("notification",notificiationSchema)