import { Router } from "express"
import { followAndUnfollowUser, getMe, getUserProfile, loginUser, logoutUser, registerUser, updateCoverImage, updateProfile, updateProfileImage } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js"
const router=Router()

router.post("/signup",registerUser)
router.post("/login",loginUser)
router.post("/logout",verifyJwt,logoutUser)
router.post("/follow/:id",verifyJwt,followAndUnfollowUser)
router.get("/profile/:username",verifyJwt,getUserProfile)
router.get("/profile",verifyJwt,getMe)
router.patch("/update",verifyJwt,updateProfile)
router.patch("/update-profile-image",verifyJwt,upload.single("profileImage"),updateProfileImage)
router.patch("/update-cover-image",verifyJwt,upload.single("coverImage"),updateCoverImage)


export default router
