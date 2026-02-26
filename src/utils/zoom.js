import axios from "axios";
import jwt from "jsonwebtoken";

// Generates a server-to-server JWT token for Zoom API requests.
// Zoom requires a short-lived JWT; set expiration to a minute or two.
export const getZoomJwt = () => {
  const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60, // token valid for 60 seconds
  };

  return jwt.sign(payload, process.env.ZOOM_API_SECRET);
};

// Create a scheduled meeting using Zoom's REST API.  The "userId" can
// usually be "me" when using a JWT app (it refers to the account owning
// the API key).
//
// Options object expects:
//   topic     - meeting title
//   startTime - ISO string (Zoom requires yyyy-MM-dd'T'HH:mm:ssZ)
//   duration  - integer minutes
//   [password] - optional password
//
export const createZoomMeeting = async ({ topic, startTime, duration, password }) => {
  const token = getZoomJwt();

  const body = {
    topic,
    type: 2, // scheduled meeting
    start_time: startTime,
    duration,
    settings: {
      join_before_host: true,
      host_video: true,
      participant_video: true,
    },
  };

  if (password) {
    body.password = password;
  }

  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
