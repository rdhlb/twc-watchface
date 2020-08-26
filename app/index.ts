import * as messaging from 'messaging';
import document from 'document';
import { me as device } from 'device';
import clock from 'clock';
import { display } from 'display';

import { startMemoryMonitoring, stopMemoryMonitoring } from './utils';
import { COMMUNICATION_ACTIONS } from '../common/constants';

const WEATHER_REQUEST_INTERVAL = 15 * 1000 * 60;

let weatherPollingInervalId;
let memoryMonitorIntervalId;
let clockPressTime;
let socketOpenTime;
let socketErrorMessage;
let socketCloseMessage;
let lastMessageReceivedTime;

const routes = {
  calendar: {
    loadJs: () => import('./calendarView'),
    guiPath: './resources/calendarView.gui'
  }
};

const onDisplayStatusChange = () => {
  if (!display.on) {
    stopMemoryMonitoring(memoryMonitorIntervalId);
  } else {
    memoryMonitorIntervalId = startMemoryMonitoring(renderMemoryUsage);
  }
};

const renderClock = (container) => {
  clock.granularity = 'seconds';
  clock.ontick = ({ date }) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    container.text = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
  };
};

const handleClockMouseDown = (e) => {
  clockPressTime = Date.now();
};

const handleClockLongPress = (e) => {
  const logsNode = document.getElementById('logs');
  const clockUnPressTime = Date.now();
  const isTimeUp = clockUnPressTime - clockPressTime > 1500;
  const logsHidden = logsNode.class === 'logs';

  if (isTimeUp && logsHidden) {
    logsNode.class = 'logsVisible';
    renderOnOpenTime();
    renderSocketErrorMessage();
    renderSocketCloseMessage();
    renderLastMessageReceivedTime();
  } else {
    logsNode.class = 'logs';
  }
};

const initView = () => {
  let myClock = document.getElementById('clock');
  renderClock(myClock);
  myClock.onclick = navigateTo(routes.calendar);
  myClock.onmousedown = handleClockMouseDown;
  myClock.onmouseup = handleClockLongPress;
  weatherPollingInervalId = startWeatherPolling();
  renderSyncTime();
  memoryMonitorIntervalId = startMemoryMonitoring(renderMemoryUsage);
  display.addEventListener('change', onDisplayStatusChange);
};

const renderMemoryUsage = (used, total) => {
  const memoryNode = document.getElementById('mem');
  memoryNode.text = `Memory usage: ${used}/${total}`;
};

const cleanUpView = () => {
  clock.granularity = 'off';
  clearInterval(weatherPollingInervalId);
  stopMemoryMonitoring(memoryMonitorIntervalId);
  display.removeEventListener('change', onDisplayStatusChange);
};

const back = () => {
  document.replaceSync('./resources/index.gui');
  initView();
};

const navigateTo = ({ loadJs, guiPath }) => () => {
  cleanUpView();

  loadJs()
    .then(({ initView }) => {
      document.replaceSync(guiPath);
      initView({ back });
    })
    .catch((e) => console.log(e));

  display.poke();
};

const renderSyncTime = () => {
  const lastSyncTimeNode = document.getElementById('lastSyncTime');
  lastSyncTimeNode.text = `Last sync at ${device.lastSyncTime?.toString()}`;
  lastSyncTimeNode.onclick = () => {
    lastSyncTimeNode.text = `Last sync at ${device.lastSyncTime?.toString()}`;
  };
};

const fetchWeather = () => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: COMMUNICATION_ACTIONS.WEATHER_REQUEST
    });
  }
};

const renderOnOpenTime = () => {
  const openNode = document.getElementById('open');
  openNode.text = `onopen at ${socketOpenTime.getHours()}:${socketOpenTime.getMinutes()}:${socketOpenTime.getSeconds()}`;
};

const renderSocketErrorMessage = () => {
  const errorNode = document.getElementById('error');
  errorNode.text = socketErrorMessage;
};

const renderSocketCloseMessage = () => {
  const closeNode = document.getElementById('close');
  closeNode.text = socketCloseMessage;
};

const renderLastMessageReceivedTime = () => {
  const lastMessageNode = document.getElementById('lastMessage');
  lastMessageNode.text = `Last message received at ${lastMessageReceivedTime.getHours()}:${lastMessageReceivedTime.getMinutes()}:${lastMessageReceivedTime.getSeconds()}`;
};

messaging.peerSocket.onopen = () => {
  socketOpenTime = new Date();
  fetchWeather();
};

messaging.peerSocket.onerror = function (err) {
  socketErrorMessage = `Code: ${err.code}; ${err.message}`;
};

messaging.peerSocket.onclose = function (data) {
  socketCloseMessage = `Code: ${data.code}, WasClean: ${data.wasClean}, Time: ${new Date().toTimeString()}`;
};

messaging.peerSocket.onmessage = ({ data: { command, data } }) => {
  lastMessageReceivedTime = new Date();
  const cityNode = document.getElementById('location');
  const currentWeatherNode = document.getElementById('currTemp');
  const highLowTempNode = document.getElementById('highLowTemp');

  if (command === COMMUNICATION_ACTIONS.WEATHER_RESPONSE) {
    cityNode.text = data.location;
    currentWeatherNode.text = `${data.temp.toFixed(0)}° ${
      data.description.charAt(0).toUpperCase() + data.description.slice(1)
    }`;
    highLowTempNode.text = `H:${data.temp_min.toFixed(0)}° L:${data.temp_max.toFixed(0)}°`;
  }
};

const startWeatherPolling = () => {
  fetchWeather();
  return setInterval(fetchWeather, WEATHER_REQUEST_INTERVAL);
};

initView();
