import * as messaging from 'messaging';
import calendars from 'calendars';

import { getCurrentPosition } from './location';
import { queryOpenWeather } from './weather';
import { COMMUNICATION_ACTIONS } from '../common/constants';
import { sendSocketMessage, handleSocketMessage } from '../common/utils';

const sendWeatherData = (data) => sendSocketMessage({ command: COMMUNICATION_ACTIONS.WEATHER_RESPONSE, data });

const sendCalendarEvents = (data) =>
  sendSocketMessage({ command: COMMUNICATION_ACTIONS.CALENDAR_EVENTS_RESPONSE, data });

const getCalendarEvents = ({ onSuccess }) => {
  const start = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const eventsQuery = { startDate: start, endDate: end };

  calendars.searchEvents(eventsQuery).then((todayEvents) => {
    const timeRestrictedEvents = todayEvents.filter((event) => !event.isAllDay);
    const { title, startDate, endDate } = timeRestrictedEvents[0] || {};
    onSuccess(JSON.stringify({ title, startDate, endDate })); // TODO: add try/catch
  });
};

const messageHandlersMap = {
  [COMMUNICATION_ACTIONS.WEATHER_REQUEST]: () =>
    getCurrentPosition({ onSuccess: queryWeatherData, onError: onGetPositionError }),
  [COMMUNICATION_ACTIONS.CALENDAR_EVENTS_REQUEST]: () => getCalendarEvents({ onSuccess: sendCalendarEvents })
};

messaging.peerSocket.onmessage = ({ data }) =>
  handleSocketMessage({ command: data.command, handlersMap: messageHandlersMap });

messaging.peerSocket.onerror = function (err) {
  console.log('Connection error: ' + err.code + ' - ' + err.message);
};

const queryWeatherData = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  queryOpenWeather({
    options: { lat, lon },
    onSuccess: sendWeatherData
  });
};

const onGetPositionError = (error) => {
  console.log('Error: ' + error.code, 'Message: ' + error.message);
};
