import { formatDateAndTime } from "@/lib/formatDateTime";
import { Html, Head, Text, Heading, Preview } from "@react-email/components";

export default function EmailTemplate(clientName: string, dateTime: string) {
  const { dateString, timeString } = formatDateAndTime(dateTime);
  return (
    <Html>
      <Head>
        <title>Appointment Confirmation</title>
      </Head>
      <Preview>Upcoming appointment with Sergio</Preview>
      <Heading as="h2">Hey, {clientName}!</Heading>
      <Text>
        Your appointment with Sergio has been confirmed for {dateString} at{" "}
        {timeString}.
      </Text>
    </Html>
  );
}
