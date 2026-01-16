import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectroute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) {
        return res.status(401).json({ msg: "unauthorized - invalid token" });
      }

      const user = await User.findOne({ clerkId });

      if (!user) {
        // return res.status(404).json({message:"user not found"});
        // user = await User.create({
        //   clerkId,
        //   email: req.auth().sessionClaims?.email,
        //   name:
        //     req.auth().sessionClaims?.name ||
        //     `${req.auth().sessionClaims?.firstName || ""} ${
        //       req.auth().sessionClaims?.lastName || ""
        //     }`,
        //   profileImage: req.auth().sessionClaims?.picture,
        // });
        const claims = req.auth().sessionClaims;

        user = await User.create({
          clerkId,
          email:
            claims?.email ||
            claims?.email_address ||
            `${clerkId}@placeholder.local`, // fallback to avoid crash

          name:
            claims?.name ||
            `${claims?.firstName || ""} ${claims?.lastName || ""}`.trim() ||
            "New User",

          profileImage: claims?.picture || null,
        });
        console.log("CLERK CLAIMS:", req.auth().sessionClaims);

      }

      req.user = user;

      next();
    } catch (error) {
      console.error("error in protect route middleware", error);
      res.status(500).json({ message: "{internal server error" });
    }
  },
];
