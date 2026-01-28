import express from "express";
import { google } from "googleapis";
import { auth } from "../middlewares/auth.js"; // your auth middleware
import User from "../models/User.js";
import jwt from "jsonwebtoken";


const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Generate Google auth URL
router.get("/google", auth, (req, res) => {
  const SCOPES = ["https://www.googleapis.com/auth/calendar"];
   const token = req.headers.authorization?.split(" ")[1];
     if (!token) {
    return res.status(401).json({ message: "JWT missing in Authorization header" });
  }
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state: token, // 🔥 JWT here
  });

  res.json({ url });
});

// Step 2: Callback after Google OAuth approval
router.get("/google/callback", async (req, res) => {
  try {
    const { code,state  } = req.query;
    if (!code || !state ) return res.status(400).json({ message: "Authorization code missing" });

    const decoded = jwt.verify(state, process.env.JWT_ACCESS_SECRET);


    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 🔥 Fetch full user document
    const user = await User.findById(decoded.sub); // full Mongoose doc
    if (!user) return res.status(404).json({ message: "User not found" });

    user.googleTokens = tokens;
    await user.save(); // now tokens are actually saved in DB

    res.status(200).json({
      success: true,
      message: "Google connected successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Google OAuth failed" });
  }
});

export default router;
