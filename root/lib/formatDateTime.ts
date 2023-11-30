import { DateTime } from "luxon";

export const formatDateAndTime = (dateTime: any) => {
  const dateString = DateTime.fromISO(dateTime).toLocal().toLocaleString();
  const timeString = DateTime.fromISO(dateTime).toLocal().toFormat("h:mm a");

  return { dateString, timeString };
};
