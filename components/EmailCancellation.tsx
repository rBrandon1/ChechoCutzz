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

export default function EmailCancellation(
  clientName: string,
  dateTime: string
) {
  const { dateString, timeString } = formatDateAndTime(dateTime);

  return (
    <Html>
      <Preview>Appointment cancelled</Preview>
      <Heading as="h2">Hey, {clientName}!</Heading>
      <Section>
        <Text>
          Your appointment with Sergio has been successfully cancelled for{" "}
          {dateString} at {timeString}.
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
