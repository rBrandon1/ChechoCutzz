import { formatDateAndTime } from "@/lib/formatDateTime";
import {
  Html,
  Head,
  Text,
  Heading,
  Preview,
  Section,
  Button,
  Hr,
} from "@react-email/components";

export default function EmailConfirmation(
  clientName: string,
  dateTime: string
) {
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
