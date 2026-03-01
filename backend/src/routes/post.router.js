import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import { commentOnPost, createPost, deletePost, getAllFollowingUsersPosts, getAllPosts, getLikedPosts, likeAndUnlikePost } from "../controllers/post.controller.js"

const router=Router()

router.get("/all",verifyJwt,getAllPosts)
router.get("/following",verifyJwt,getAllFollowingUsersPosts)
router.get("/liked",verifyJwt,getLikedPosts)
router.post("/create",verifyJwt,upload.single("image"),createPost)
router.post("/comment/:id",verifyJwt,commentOnPost)
router.patch("/like/:id",verifyJwt,likeAndUnlikePost)
router.delete("/:id",verifyJwt,deletePost)

export default router
