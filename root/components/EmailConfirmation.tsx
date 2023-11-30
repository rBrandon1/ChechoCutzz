import { formatDateAndTime } from "@/lib/formatDateTime";
import {
  Html,
  Text,
  Heading,
  Preview,
  Section,
  Button,
  Hr,
} from "@react-email/components";

// function formatDateTimeForUrl(dateTime: any) {
//   const dateObj = new Date(dateTime);
//   return dateObj.toISOString().replace(/-|:|\.\d\d\d/g, "");
// }
export default function EmailConfirmation(
  clientName: string,
  dateTime: string
) {
  // const startDateTimeForUrl = formatDateTimeForUrl(dateTime);
  // const endDateTimeForUrl = formatDateTimeForUrl(
  //   new Date(new Date(dateTime).getMinutes() + 30)
  // );
  // const provider = {
  //   google: `https://www.google.com/calendar/render?action=TEMPLATE&text=Haircut with Sergio&dates=${startDateTimeForUrl}/${endDateTimeForUrl}&details=Your upcoming haircut appointment.`,
  //   yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=Haircut with Sergio&st=${startDateTimeForUrl}&et=${endDateTimeForUrl}&desc=Your upcoming haircut appointment.`,
  //   apple: "/api/generate-ics?startDateTime=${formatDateTimeForUrl(dateTime)}",
  // };
  const { dateString, timeString } = formatDateAndTime(dateTime);

  return (
    <Html>
      <Preview>Upcoming appointment with Sergio</Preview>
      <Heading as="h2">Hey, {clientName}!</Heading>
      <Section>
        <Text>
          Your appointment with Sergio has been confirmed for {dateString} at{" "}
          {timeString}.
        </Text>
      </Section>
      <Hr />
      <Section>
        <Text>
          Manage your appointments{" "}
          <Button href="https://chechocutzz.com">here.</Button>
        </Text>
      </Section>
    </Html>
  );
}
