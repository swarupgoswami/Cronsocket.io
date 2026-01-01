import express from "express";
import {ENV} from "./lib/env.js";



const app=express();



app.get('/',(req,res)=>{
    console.log("...")
});


app.listen(ENV.PORT,()=>{console.log("server is running on localhost3000")});
