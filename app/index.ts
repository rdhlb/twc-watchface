import * as messaging from 'messaging';
import document from 'document';
import { me as device } from 'device';
import clock from 'clock';
import { display } from 'display';
import { vibration } from 'haptics';

import {
  startMemoryMonitoring,
  stopMemoryMonitoring,
  getTimeString,
  getDate,
  startPolling,
  handleLongPress,
  getDayShort,
  findByIdAndRender
} from './utils';
import { sendSocketMessage, handleSocketMessage } from '../common/utils';
import {
  COMMUNICATION_ACTIONS,
  WEATHER_REQUEST_INTERVAL,
  CALENDAR_REQUEST_INTERVAL,
  WEATHER_RESPONSE_TIMEOUT
} from '../common/constants';
import { navigate, ROUTES } from './navigation';
import WeatherUI from './ui/weather';
import CalendarEventUI from './ui/calendarEvent';
import Logs from './ui/logs';

let weatherPollingInervalId;
let memoryMonitorIntervalId;
let socketOpenTime;
let socketErrorMessage;
let socketCloseMessage;
let lastMessageReceivedTime;
let calendarPollingInervalId;
let noWeatherResponseTimeoutId;

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

const renderLogs = () => {
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

const addClockLongPressHandler = () => {
  const container = document.getElementById('clock');
  handleLongPress(container, renderLogs);
};

const renderClock = (date) => {
  const container = document.getElementById('clock');
  container.text = getTimeString(date);
};

const renderDateAndDay = (date) => {
  const dayOfWeekNode = document.getElementById('dayOfWeek');
  const currentDateNode = document.getElementById('currentDate');

  dayOfWeekNode.text = getDayShort(date).toUpperCase();
  currentDateNode.text = String(getDate(date));
};

const renderCalendarButton = () => {
  const hiddenCalButton = document.getElementById('hiddenCalButton');

  hiddenCalButton.onclick = navigate(ROUTES.calendar, back, onViewCleanUp);
};

const initView = () => {
  initClock();
  addClockLongPressHandler();
  weatherPollingInervalId = startPolling(fetchWeather, WEATHER_REQUEST_INTERVAL);
  calendarPollingInervalId = startPolling(fetchCalendarEvents, CALENDAR_REQUEST_INTERVAL);
  display.addEventListener('change', onDisplayStatusChange);
  renderCalendarButton();
};

const renderMemoryUsage = (used, total) => findByIdAndRender('mem', `Memory usage: ${used}/${total}`);

const onViewCleanUp = () => {
  clock.granularity = 'off';
  clearInterval(weatherPollingInervalId);
  clearInterval(calendarPollingInervalId);
  stopMemoryMonitoring(memoryMonitorIntervalId);
  display.removeEventListener('change', onDisplayStatusChange);
};

const back = () => {
  vibration.start('bump');
  document.replaceSync('./resources/index.gui');
  initView();
};

const fetchWeather = () => {
  const weatherComponent = new WeatherUI();
  const isWeatherDataAvailable = weatherComponent.currentWeatherNode.text !== 'No weather data';

  if (!noWeatherResponseTimeoutId && !isWeatherDataAvailable) {
    weatherComponent.currentWeatherNode.text = 'Loading weather...';
    noWeatherResponseTimeoutId = setTimeout(() => {
      weatherComponent.currentWeatherNode.text = 'No weather data';
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

  const weatherComponent = new WeatherUI();
  weatherComponent.render({
    location: data.location,
    temp: data.temp,
    description: data.description,
    forecast: { min: data.temp_min, max: data.temp_max }
  });
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

const messageHandlersMap = {
  [COMMUNICATION_ACTIONS.WEATHER_RESPONSE]: handleWeatherResponse,
  [COMMUNICATION_ACTIONS.CALENDAR_EVENTS_RESPONSE]: handleCalendarResponse
};

initView();
