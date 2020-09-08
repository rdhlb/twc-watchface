import * as messaging from 'messaging';

import { getCurrentPosition } from './location';
import { fetchWeather } from './weather';
import { COMMUNICATION_ACTIONS } from '../common/constants';
import { sendSocketMessage, handleSocketMessage } from '../common/utils';
import { getCalendarEvents } from './calendar';
import { initSettingsListening } from './settings';

const sendWeatherData = (data) => sendSocketMessage({ command: COMMUNICATION_ACTIONS.WEATHER_RESPONSE, data });

const sendCalendarEvents = (data) =>
  sendSocketMessage({ command: COMMUNICATION_ACTIONS.CALENDAR_EVENTS_RESPONSE, data });

const sendSettings = (data) => sendSocketMessage({ command: COMMUNICATION_ACTIONS.CHANGE_SETTINGS, data });

const handleWeatherRequest = async () => {
  try {
    const { coords } = await getCurrentPosition();
    const weatherData = await fetchWeather(coords);
    sendWeatherData(weatherData);
  } catch (error) {
    console.log(error);
  }
};

const messageHandlersMap = {
  [COMMUNICATION_ACTIONS.WEATHER_REQUEST]: handleWeatherRequest,
  [COMMUNICATION_ACTIONS.CALENDAR_EVENTS_REQUEST]: () => getCalendarEvents({ onSuccess: sendCalendarEvents })
};

messaging.peerSocket.onmessage = ({ data }) =>
  handleSocketMessage({ command: data.command, handlersMap: messageHandlersMap });

messaging.peerSocket.onerror = function (err) {
  console.log('Connection error: ' + err.code + ' - ' + err.message);
};

initSettingsListening({ onChange: sendSettings });
