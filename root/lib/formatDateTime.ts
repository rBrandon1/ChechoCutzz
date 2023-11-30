import { DateTime } from "luxon";

export const formatDateAndTime = (dateTime: any) => {
  const localDateTime = DateTime.fromISO(dateTime).toLocal();
  const dateString = localDateTime.toLocaleString(
    DateTime.DATE_MED_WITH_WEEKDAY
  );
  const timeString = localDateTime.toLocaleString(DateTime.TIME_SIMPLE);

  return { dateString, timeString };
};
