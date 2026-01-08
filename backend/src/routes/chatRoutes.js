import express from "express";
import { protectroute } from "../middlewares/protectRoute.js";
import { getStreamToken } from "../controllers/chatController.js";




const router=express.Router()


router.get('/token',protectroute,getStreamToken);

export default router;