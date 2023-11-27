/**
 *
 * TODO: Work on this another time
 *
 */

// import type { NextApiRequest, NextApiResponse } from "next";
// import ical from "ical-generator";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const startDateTime = Array.isArray(req.query.startDateTime)
//     ? req.query.startDateTime[0]
//     : req.query.startDateTime;

//   const clientName = Array.isArray(req.query.clientName)
//     ? req.query.clientName[0]
//     : req.query.clientName;

//   if (typeof startDateTime !== "string" || !Date.parse(startDateTime)) {
//     res.status(400).send("Invalid start date time");
//     return;
//   }

//   const endDateTime = new Date(new Date(startDateTime).getTime() + 30 * 60000); // 30 minutes later

//   const calendar = ical({ name: "Haircut with Sergio" });
//   calendar.createEvent({
//     start: new Date(startDateTime),
//     end: new Date(endDateTime),
//     summary: `Appointment with Sergio`,
//     description: "Your upcoming appointment.",
//   });

//   res.setHeader("Content-Type", "text/calendar");
//   res.send(calendar.toString());
// }
