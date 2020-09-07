import * as messaging from 'messaging';
import document from 'document';
import { me as device } from 'device';
import clock from 'clock';
import { display } from 'display';
import { vibration } from 'haptics';
import { launchApp } from 'system';

import { startMemoryMonitoring, stopMemoryMonitoring, startPolling, handleLongPress, findByIdAndRender } from './utils';
import { sendSocketMessage, handleSocketMessage } from '../common/utils';
import {
  COMMUNICATION_ACTIONS,
  WEATHER_REQUEST_INTERVAL,
  CALENDAR_REQUEST_INTERVAL,
  WEATHER_RESPONSE_TIMEOUT,
  FITBIT_AGENDA_APP_UUID,
  FITBIT_WEATHER_APP_UUID
} from '../common/constants';
import { navigate, ROUTES } from './navigation';
import WeatherUI from './ui/weather';
import CalendarEventUI from './ui/calendarEvent';
import Logs from './ui/logs';
import { renderClock, renderDateAndDay } from './ui/misc';

let weatherPollingInervalId;
let memoryMonitorIntervalId;
let socketOpenTime;
let socketErrorMessage;
let socketCloseMessage;
let lastMessageReceivedTime;
let calendarPollingInervalId;
let noWeatherResponseTimeoutId;
let weatherData;

const onDisplayStatusChange = () => {
  if (!display.on) {
    hideLogs();
  }
};

const hideLogs = () => {
  const logsNode = document.getElementById('logs');
  logsNode.class = 'logs';
  stopMemoryMonitoring(memoryMonitorIntervalId);
};

const toggleLogs = () => {
  const logsNode = document.getElementById('logs');
  const logsHidden = logsNode.class === 'logs';

  if (logsHidden) {
    logsNode.class = 'logs--visible';
    const logsComponent = new Logs();
    logsComponent.render({
      socketOpenTime,
      socketErrorMessage,
      socketCloseMessage,
      lastMessageReceivedTime,
      lastSyncTime: device.lastSyncTime
    });
    memoryMonitorIntervalId = startMemoryMonitoring(renderMemoryUsage);
  } else {
    hideLogs();
  }
};

const initClock = () => {
  clock.granularity = 'seconds';
  clock.ontick = ({ date }) => {
    renderClock(date);
    renderDateAndDay(date);
  };
};

const addClockLongPressHandler = (cb) => {
  const container = document.getElementById('clock');

  handleLongPress(container, cb);
};

const renderCalendarButton = () => {
  const hiddenCalButton = document.getElementById('hiddenCalButton');

  hiddenCalButton.onclick = navigate(ROUTES.calendar, back, onViewCleanUp);
};

const openAgendaApp = () => {
  try {
    launchApp(FITBIT_AGENDA_APP_UUID);
  } catch (error) {
    console.log('Error launching agenda app');
  }
};

const openWeatherApp = () => {
  try {
    launchApp(FITBIT_WEATHER_APP_UUID);
  } catch (error) {
    console.log('Error launching weather app');
  }
};

const addAgendaButtonPressHandler = (cb) => {
  const container = document.getElementById('hiddenAgendaButton');

  container.onclick = cb;
};

const addWeatherButtonPressHandler = (cb) => {
  const container = document.getElementById('hiddenWeatherButton');

  container.onclick = cb;
};

// We need to init view on navigation because in case of document.replaseSync (which is navigation)
// document is cleaned up and all of the references are lost
const initView = (shouldInitPolling = false) => {
  initClock();
  addClockLongPressHandler(toggleLogs);
  addAgendaButtonPressHandler(openAgendaApp);
  addWeatherButtonPressHandler(openWeatherApp);
  if (shouldInitPolling) {
    weatherPollingInervalId = startPolling(fetchWeather, WEATHER_REQUEST_INTERVAL);
    calendarPollingInervalId = startPolling(fetchCalendarEvents, CALENDAR_REQUEST_INTERVAL);
  }
  display.addEventListener('change', onDisplayStatusChange);
  renderCalendarButton();
};

const renderMemoryUsage = (used, total) => findByIdAndRender('mem', `Memory usage: ${used}/${total}`);

const onViewCleanUp = () => {
  clock.granularity = 'off';
  clearInterval(weatherPollingInervalId);
  clearInterval(calendarPollingInervalId);
  hideLogs();
  display.removeEventListener('change', onDisplayStatusChange);
};

const back = () => {
  vibration.start('bump');
  document.replaceSync('./resources/index.gui');
  initView(true);
};

const fetchWeather = () => {
  const weatherUI = new WeatherUI();
  if (weatherData) {
    weatherUI.render({
      location: weatherData.location,
      temp: weatherData.temp,
      description: weatherData.description,
      forecast: { min: weatherData.temp_min, max: weatherData.temp_max }
    });
  }

  if (!noWeatherResponseTimeoutId && !weatherData) {
    weatherUI.renderLoading();
    noWeatherResponseTimeoutId = setTimeout(() => {
      weatherUI.renderEmptyState();
    }, WEATHER_RESPONSE_TIMEOUT);
  }

  sendSocketMessage({
    command: COMMUNICATION_ACTIONS.WEATHER_REQUEST
  });
};

const fetchCalendarEvents = () =>
  sendSocketMessage({
    command: COMMUNICATION_ACTIONS.CALENDAR_EVENTS_REQUEST
  });

messaging.peerSocket.onopen = () => {
  socketOpenTime = new Date();
  fetchWeather();
  fetchCalendarEvents();
};

messaging.peerSocket.onerror = function (err) {
  socketErrorMessage = `Code: ${err.code}; ${err.message}`;
};

messaging.peerSocket.onclose = function (data) {
  socketCloseMessage = `Code: ${data.code}, WasClean: ${data.wasClean}, Time: ${new Date().toTimeString()}`;
};

messaging.peerSocket.onmessage = ({ data: { command, data } }) => {
  lastMessageReceivedTime = new Date();
  handleSocketMessage({ command, handlersMap: messageHandlersMap, data });
};

const handleWeatherResponse = (data) => {
  clearTimeout(noWeatherResponseTimeoutId);
  noWeatherResponseTimeoutId = null;

  if (data) {
    weatherData = data;
    const weatherUI = new WeatherUI();

    weatherUI.render({
      location: weatherData.location,
      temp: weatherData.temp,
      description: weatherData.description,
      forecast: { min: weatherData.temp_min, max: weatherData.temp_max }
    });
  }
};

const handleCalendarResponse = (data) => {
  let calendarEvent: { title: string; endDate: string; startDate: string };
  try {
    calendarEvent = JSON.parse(data);
  } catch (error) {
    console.log('Error parsing calendar event', error);
  }

  const { startDate, endDate, title } = calendarEvent || {};

  if (startDate && endDate && title) {
    const calendarEventComponent = new CalendarEventUI();
    calendarEventComponent.render({ title, start: new Date(startDate), end: new Date(endDate) });
  }
};

const handleSettingsChange = ({ key, value }: { key: string; value?: string }) => {
  const accentNodes = document.getElementsByClassName('accent');
  accentNodes.forEach((node: Element) => {
    // TODO: extend Element interface or make a PR with corresponding change to types library
    // @ts-ignore
    node.style.fill = value;
  });
};

const messageHandlersMap = {
  [COMMUNICATION_ACTIONS.WEATHER_RESPONSE]: handleWeatherResponse,
  [COMMUNICATION_ACTIONS.CALENDAR_EVENTS_RESPONSE]: handleCalendarResponse,
  [COMMUNICATION_ACTIONS.CHANGE_SETTINGS]: handleSettingsChange
};

initView();
