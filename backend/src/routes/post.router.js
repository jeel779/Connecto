import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { commentOnPost, createPost, deletePost, likeOnPost } from "../controllers/post.controller.js"

const router=Router()

router.post("/create",verifyJwt,upload.single("image"),createPost)
router.delete("/:id",verifyJwt,deletePost)
router.post("/comment/:id",verifyJwt,commentOnPost)
router.patch("/:id",verifyJwt,likeOnPost)

//get all the followings
//upload post
//comment in post
//get all the posts

export default router
