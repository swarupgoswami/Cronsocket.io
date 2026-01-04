import {Inngest} from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "cronsocket-io"});


const syncUsers = inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async({event})=>{
        await connectDB();

    //    destructuring the the entire event body incoming from clerk webhook
        const {id,email_addresses,first_name,last_name,image_url}=event.data;

        const newUser={
            clerkId:id,
            email:email_addresses[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            profileImage:image_url

        }

        // saving the user to the database
        await User.create(newUser);
    }
)

const deleteUsersFromDb = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async({event})=>{
        await connectDB();

    //    destructuring the the entire event body incoming from clerk webhook
        const {id}=event.data;
        await User.deleteOne({ClerkId:id});
    }
)

export const functions=[syncUsers , deleteUsersFromDb];