import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/", async (req, res) => {
  const { language, code } = req.body;

  if (!language || !code) {
    return res.json({
      success: false,
      error: "Language and code are required",
    });
  }

  // Temp file name
  let filename = "";

  if (language === "javascript") filename = "temp.js";
  else if (language === "python") filename = "temp.py";
  else {
    return res.json({
      success: false,
      error: "Only JS and Python supported locally for now",
    });
  }

  // Save code into temp file
  fs.writeFileSync(filename, code);

  // Command to run
  let command = "";

  if (language === "javascript") command = `node ${filename}`;
  if (language === "python") command = `python ${filename}`;

  // Execute code
  exec(command, (err, stdout, stderr) => {
    if (err || stderr) {
      return res.json({
        success: false,
        error: stderr || err.message,
      });
    }

    return res.json({
      success: true,
      output: stdout || "No Output",
    });
  });
});

export default router;

