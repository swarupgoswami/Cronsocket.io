import Session from "../models/Session.js";
import { chatClient, streamClient } from "../lib/stream.js";

export async function createSession(req,res){
    try {
        const {problem,difficulty}=req.body;

        const userId=req.user._id;
        const clerkId=req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({messgae:"problem and difficulty are required"});
        };


        const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        // create session in databse
        const session=await Session.create({problem,difficulty,host:userId,callId});

        await streamClient.video.call('default',callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom:{problem,difficulty,sessionId:session._id.toString()},
            },
        });


        const channel=chatClient.channel('messaging',callId,{
            name:`${problem} Session`,
            members:[clerkId],
            created_by_id:clerkId,
        })

        await channel.create();



        res.status(201).json({session});


        
        
    } catch (error) {
        console.error("error creating session", error);
        res.status(500).json({message:"internal server error"});
    }
}


export const getActiveSessions=async(req,res)=>{
    try {
        const sessions=await Session.find({status:"active"})
        .populate("host","name profileImage email clerkId")
        .sort({createdAt:-1})
        .limit(20);

        res.status(200).json({sessions});

    } catch (error) {
        console.error("error fetching active sessions", error);
        res.status(500).json({message:"internal server error"});
    }
}



export async function getMyRecentSessions(req,res){
    try {
        

        const userId=req.user._id;

        const sessions=await Session.find({
            status:"completed",
            $or:[{host:userId},{participants:userId}],
        })
        .sort({createdAt:-1})
        .limit(20)

        res.status(200).json({sessions});

    } catch (error) {
        console.error("error fetching my recent sessions", error);
        res.status(500).json({message:"internal server error"});
    }
}


export async function getSessionById(req,res){
    try {

        const {id}=req.params;

        const sessions=await findById(id)
        .populate("host","name profileImage email clerkId")
        .populate("participants","name profileImage email clerkId");

        if(!sessions){
            return res.status(404).json({message:"session not found"});
        }

        res.status(200).json({sessions});
        
    } catch (error) {
        console.error("error fetching session by id", error);
        res.status(500).json({message:"internal server error"});
    }
}


export async function joinSession(req,res){
    try {
        const {id}=req.params;
        const userId=req.user._id;
        const clerkId=req.user.clerkId;

        const session=await Session.findById(id);

        if(!session){
            return res.status(404).json({message:"session not found"});
        }

        if(session.status!=="active"){
            return res.status(400).json({message:"session is not active"});
        }

        if(session.host.toString()===userId.toString()){
            return res.status(400).json({message:"host cannot join the session as participant"});
        }

        if(session.participants){
            return res.status(409).json({message:"user already joined the session"});
        }
        

        session.participant=userId;
        await session.save();

        const channel=chatClient.channel('messaging',session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({session});


    } catch (error) {
        console.error("error joining session", error);
        res.status(500).json({message:"internal server error"});
    }
}


export async function endSession(req,res){
    try {
        const {id}=req.params;
        const userId=req.user._id;

        const session=await Session.findById(id);
        if(!session){
            return res.status(404).json({message:"session not found"});
        }

        if(session.host.toString()!==userId.toString()){
            return res.status(403).json({message:"only host can end the session"});
        }

        if(session.status==="completed"){
            return res.status(400).json({message:"session already completed"});
        }

        

        const call= streamClient.video.call('default',session.callId);
        await call.delete({hard:true});

        const channel=chatClient.channel('messaging',session.callId);
        await channel.delete();


        session.status="completed";
        await session.save();

        res.status(200).json({session});


    } catch (error) {
        console.error("error ending session", error);
        res.status(500).json({message:"internal server error"});
    }
}