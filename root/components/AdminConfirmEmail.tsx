import { formatDateAndTime } from "@/lib/formatDateTime";
import {
  Html,
  Text,
  Heading,
  Preview,
  Section,
  Button,
  Hr,
  Link,
} from "@react-email/components";

export default function AdminConfirmEmail(
  clientName: string,
  dateTime: string,
  clientEmail: string
) {
  const { dateString, timeString } = formatDateAndTime(dateTime);
  return (
    <Html>
      <Preview>You have an upcoming appointment</Preview>
      <Heading as="h2">Hey, Sergio!</Heading>
      <Section>
        <Text>
          There is a new appointment with {clientName} for {dateString} at{" "}
          {timeString}.
        </Text>
        <Text>
          You can contact them at{" "}
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
