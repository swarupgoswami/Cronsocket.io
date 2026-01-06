// routes/clerkWebhook.js
import express from "express";
import { inngest } from "../lib/inngest.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  const event = req.body;

  
  if (event.type === "user.created") {
    await inngest.send({
      name: "clerk.user.created",
      data: event.data,
    });
  }

  if (event.type === "user.deleted") {
    await inngest.send({
      name: "clerk.user.deleted",
      data: event.data,
    });
  }

  res.status(200).json({ received: true });
});

export default router;
