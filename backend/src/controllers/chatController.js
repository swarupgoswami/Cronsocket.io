import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res){
    try {
        const token= chatClient.createToken(req.user.clerkId);

        res.status(200).json({
            token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.profileImage,
        })
    } catch (error) {
        console.error("error generating stream token", error);
        res.status(500).json({message:"internal server error"});
    }
}


// export async function getStreamToken(req, res) {
//   try {
//     const userId = req.user.clerkId;

//     const chatToken = chatClient.createToken(userId);
//     const videoToken = streamClient.createToken(userId);

//     res.status(200).json({
//       chatToken,
//       videoToken,
//       userId,
//       userName: req.user.name,
//       userImage: req.user.profileImage,
//     });
//   } catch (error) {
//     console.error("error generating stream token", error);
//     res.status(500).json({ message: "internal server error" });
//   }
// }