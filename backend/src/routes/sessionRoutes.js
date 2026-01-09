import express from "express";
import { protectroute } from "../middlewares/protectRoute.js";
import { createSession, endSession, getActiveSessions, getMyRecentSessions, getSessionById, joinSession } from "../controllers/sessionController.js";

const router=express.Router();


router.post('/',protectroute,createSession);
router.get('/active',protectroute,getActiveSessions);
router.get('/my-recent',protectroute,getMyRecentSessions);


router.get('/:id',protectroute,getSessionById);
router.post('/:id/join',protectroute,joinSession);
router.post('/:id/end',protectroute,endSession);

export default router;