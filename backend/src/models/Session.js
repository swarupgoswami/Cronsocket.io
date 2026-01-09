import mongoose from "mongoose";

const sessionSchema=new mongoose.Schema({
   problem:{
    type:String,
    required:true,
   },
   difficulty:{
    type:String,
    enum:["easy","medium","hard"],
    required:true,
   },
   host:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true,
   },
   participant:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    default:null,
   },
   status:{
    type:String,
    enum:["active","completed"],
    default:"active",
   },
   callId:{
    type:String,
    default:"",
   }
},{timestamps:true});

const session=mongoose.model("session",sessionSchema);

export default session;