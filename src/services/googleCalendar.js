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
  participants,
}) => {
  const event = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: title,
      description,
      start: { dateTime: startTime },
      end: { dateTime: endTime },
    },
  });

  return event.data;
};
