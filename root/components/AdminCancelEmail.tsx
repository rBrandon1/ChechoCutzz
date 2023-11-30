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

export default function AdminCancelEmail(
  firstName: string,
  lastName: string,
  dateTime: string,
  clientEmail: string
) {
  const { dateString, timeString } = formatDateAndTime(dateTime);
  return (
    <Html>
      <Preview>A client has cancelled their appointment.</Preview>
      <Heading as="h2">Hey, Sergio!</Heading>
      <Section>
        <Text>
          {firstName} {lastName} has cancelled their appointment for{" "}
          {dateString} at {timeString}. The appointment has been set to
          &quot;available&quot; and can be booked by another client.
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
