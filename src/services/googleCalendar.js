
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";

/* ------------------ Fix __dirname (ESM) ------------------ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------ Load token.json ------------------ */
const TOKEN_PATH = path.join(__dirname, "../../token.json");

if (!fs.existsSync(TOKEN_PATH)) {
  throw new Error("❌ token.json not found. Run generateToken.js first.");
}

const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

/* ------------------ OAuth Client ------------------ */
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oAuth2Client.setCredentials(token);

/* ------------------ Calendar Client ------------------ */
const calendar = google.calendar({
  version: "v3",
  auth: oAuth2Client,

import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(
    __dirname,
    "./keys/syncaura-calendar-integration-d8e788e7bf75.json"
  ),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({
  version: "v3",
  auth,

});

export const createCalendarEvent = async ({
  title,
  description,
  startTime,
  endTime,

  participants = [],

  participants,

}) => {
  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description,

      start: {
        dateTime: startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: participants.map((email) => ({ email })),
    },
  });

  return event.data;
};

/*                 UPDATE CALENDAR EVENT                 */

export const updateCalendarEvent = async (eventId, data) => {
  const event = await calendar.events.patch({
    calendarId: "primary",
    eventId,
    requestBody: {
      summary: data.title,
      description: data.description,
      start: {
        dateTime: data.startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: data.endTime,
        timeZone: "Asia/Kolkata",
      },
      attendees: data.participants?.map((email) => ({ email })),

      start: { dateTime: startTime },
      end: { dateTime: endTime },

    },
  });

  return event.data;
};

export const deleteCalendarEvent = async (eventId) => {
  await calendar.events.delete({
    calendarId: "primary",
    eventId,
  });
};


