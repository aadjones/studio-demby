// Generate an .ics file for a yearly, all-day anniversary reminder
export const generateAnniversaryIcs = (
  title: string,
  date: Date,
  description?: string
): void => {
  // Use the venue's time zone so the day stays Oct 24 wherever the file is opened
  const formatIcsDate = (d: Date): string =>
    d.toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' }).replace(/-/g, '');

  const eventDate = formatIcsDate(date);
  // All-day events end on the following day (DTEND is exclusive)
  const dayAfter = formatIcsDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Studio Demby//Married For//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${eventDate}`,
    `DTEND;VALUE=DATE:${dayAfter}`,
    'RRULE:FREQ=YEARLY',
    `DTSTAMP:${timestamp}`,
    // Stable UID, so adding it a second time updates the event instead of duplicating it
    `UID:anniversary-${eventDate}@studiodemby.com`,
    `SUMMARY:${title}`,
    ...(description ? [`DESCRIPTION:${description}`] : []),
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'anniversary.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
