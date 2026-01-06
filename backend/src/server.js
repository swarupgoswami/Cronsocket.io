import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import clerkWebhook from "./routes/clerkWebhook.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
    dev: true,
  })
);

app.use("/api/clerk", clerkWebhook);

app.get("/health", (req, res) => {
  // console.log("...")
  res.status(200).json({ message: "api is running" });
});

app.get("/books", (req, res) => {
  // console.log("...")
  res.status(200).json({ message: "api is running" });
});

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log("server is running on localhost3000");
  connectDB();
});
