import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { ENV } from "./env.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({
  id: "cronsocket-io",
  eventKey: ENV.INNGEST_EVENT_KEY,
});

const syncUsers = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk.user.created" },
  async ({ event }) => {
    await connectDB();

    // //    destructuring the the entire event body incoming from clerk webhook

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = event.data;

    if (!id) {
      console.error("❌ Clerk user id missing, skipping event");
      return;
    }

    await User.findOneAndUpdate(
      { clerkId: id },
      {
        clerkId: id,
        email: email_addresses?.[0]?.email_address,
        name: `${first_name ?? ""} ${last_name ?? ""}`,
        profileImage: image_url,
      },
      { upsert: true, new: true }
    );

    console.log("✅ User synced:", id);



    await upsertStreamUser({
      id: id.toString(),
      name: `${first_name ?? ""} ${last_name ?? ""}`,
      image: image_url,

    })
  }
);


// function that wil delete user from the database when clerk user is deleted 
const deleteUsersFromDb = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk.user.deleted" },
  async ({ event }) => {
    await connectDB();

    //    destructuring the the entire event body incoming from clerk webhook
    const { id } = event.data;
    if (!id) {
      console.error("❌ Clerk user id missing on delete");
      return;
    }
    await User.deleteOne({ clerkId: id });

    console.log("user deleted from database:", id);

    await deleteStreamUser(id.toString());

  }
);

export const functions = [syncUsers, deleteUsersFromDb];
