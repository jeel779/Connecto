import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { deleteAllNotifications, getNotifications } from "../controllers/notification.controller.js";

const router=Router()

router.get("/",verifyJwt,getNotifications)
router.delete("/",verifyJwt,deleteAllNotifications)

export default router