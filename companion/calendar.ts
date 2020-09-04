import calendars from 'calendars';

export const getCalendarEvents = ({ onSuccess }) => {
  const start = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const eventsQuery = { startDate: start, endDate: end };

  calendars
    .searchEvents(eventsQuery)
    .then((todayEvents) => {
      const timeRestrictedEvents = todayEvents.filter((event) => !event.isAllDay);
      const { title, startDate, endDate } = timeRestrictedEvents[0] || {};
      const payload = JSON.stringify({ title, startDate, endDate });

      onSuccess(payload);
    })
    .catch((err) => console.log(err));
};
