import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    profileImage:{
        type:String,
        default:"",
    },
    clerkId:{
        type:String,
        required:true,
        unique:true,
        sparse: true,

    },


},
{timestamps:true}
);


const user=mongoose.model("user",userSchema);

export default user;