import moment from "moment-timezone";

export const formatDateAndTime = (dateTime: string) => {
  const dateObj = moment.tz(dateTime, "America/Los_Angeles").toDate();
  const dateString = dateObj?.toLocaleDateString();

  const timeString = dateObj?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { dateString, timeString };
};
