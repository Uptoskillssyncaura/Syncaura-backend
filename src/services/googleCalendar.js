import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load token
const tokenPath = path.join(__dirname, "../../token.json");
const token = JSON.parse(fs.readFileSync(tokenPath, "utf8"));

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials(token);

const calendar = google.calendar({
  version: "v3",
  auth: oAuth2Client,
});

// ✅ THIS FUNCTION MUST EXIST
export const createCalendarEvent = async ({
  title,
  description,
  startTime,
  endTime,
  participants,
}) => {
  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
      attendees: participants?.map((email) => ({ email })),
    },
  });

  return event.data;
};