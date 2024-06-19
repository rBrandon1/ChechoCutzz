import { formatDateAndTime } from "@/lib/formatDateTime";
import {
  Html,
  Head,
  Text,
  Heading,
  Preview,
  Link,
  Section,
  Hr,
  Button,
} from "@react-email/components";

export default function EmailDeletion(clientName: string, dateTime: string) {
  const { dateString, timeString } = formatDateAndTime(dateTime);
  return (
    <Html>
      <Preview>Appoinment cancelled by barber</Preview>
      <Heading as="h2">Hey {clientName},</Heading>
      <Section>
        <Text>
          Unfortunately your appointment with Sergio has been cancelled for{" "}
          {dateString} at {timeString}.
        </Text>
        <Text>
          If this is your first time hearing about it, reach out to Sergio on{" "}
          <Link href="https://www.instagram.com/checho.cutzz/">Instagram</Link>.
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
