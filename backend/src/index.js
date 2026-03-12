import express from "express"
import connectDB from "./utils/db.js"
import 'dotenv/config' 
import userRouter from "./routes/user.router.js"
import postRouter from "./routes/post.router.js"
import notificationRouter from "./routes/notification.router.js"
import cookieParser from "cookie-parser"
import cors from "cors"
const app =express()
const port=process.env.PORT || 5000

connectDB()
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/user",userRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/notifications",notificationRouter)

app.listen(port,()=>{
    console.log(`server is running at port ${port}`)
})