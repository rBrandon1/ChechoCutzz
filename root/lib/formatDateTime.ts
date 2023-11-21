export const formatDateAndTime = (dateTime: string) => {
  const dateObj = new Date(dateTime);
  const dateString = dateObj.toLocaleDateString();

  const timeString = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { dateString, timeString };
};
