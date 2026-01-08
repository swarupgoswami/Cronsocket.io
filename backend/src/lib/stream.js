import {StreamChat} from "stream-chat";
import {ENV} from "./env.js";

const apiKey=ENV.STREAM_API_KEY;
const apiSecret=ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret ){
    console.error("stream api key or secret key is missing");
}

export const chatClient=StreamChat.getInstance(apiKey,apiSecret);


export const upsertStreamUser=async(userData)=>{
    try {

        await chatClient.upsertUser(userData);
        console.log("stream user updated succesfully",userData);
        
    } catch (error) {

        console.error("error upsering stream user", error);
        
    }
}

export const deleteStreamUser=async(userId)=>{
    try {

        await chatClient.deleteUser([userId]);
        console.log("stream user deleted successfully",userId);
        
    } catch (error) {

        console.error("error deleting stream user", error);
        
    }
}