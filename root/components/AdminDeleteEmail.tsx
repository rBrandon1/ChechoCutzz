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
  Link,
} from "@react-email/components";

export default function AdminDeleteEmail(
  clientName: string,
  dateTime: string,
  clientEmail: string
) {
  const { dateString, timeString } = formatDateAndTime(dateTime);
  return (
    <Html>
      <Preview>You have deleted an appointment</Preview>
      <Heading as="h2">Hey, Sergio!</Heading>
      <Section>
        <Text>
          Looks like you deleted an appointment with {clientName} for{" "}
          {dateString} at {timeString}.
        </Text>
        <Text>
          If this was a mistake, you can still contact them at{" "}
          <Link href={`mailto:${clientEmail}`}>{clientEmail}</Link>
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
