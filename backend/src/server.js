import express from "express";
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";



const app=express();



app.get('/',(req,res)=>{
    console.log("...")
});


app.listen(ENV.PORT,()=>{console.log("server is running on localhost3000");
    connectDB();
});
