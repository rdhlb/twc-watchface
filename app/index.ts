import * as messaging from 'messaging';
import document from 'document';
import { me as device } from 'device';
import clock from 'clock';
import { display } from 'display';
import { memory } from 'system';

const WEATHER_REQUEST_INTERVAL = 15 * 1000 * 60;

// TODO: handle AM/PM setting
// TODO: refactor ontick function (rethink slices)

let weatherPollingInervalId;
let memoryCounterIntervalId;

const routes = {
  calendar: {
    loadJs: () => import('./calendarView'),
    guiPath: './resources/calendarView.gui'
  }
};

const onDisplayStatusChange = () => {
  console.log('display change event in index');
  if (!display.on) {
    clearInterval(memoryCounterIntervalId);
  } else {
    renderMemoryUsage();
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

const initView = () => {
  let myClock = document.getElementById('clock');
  renderClock(myClock);
  myClock.onclick = navigateTo(routes.calendar);
  const startWeatherPolling = initPeerCommunication();
  weatherPollingInervalId = startWeatherPolling();
  renderSyncTime();
  renderMemoryUsage();
  display.addEventListener('change', onDisplayStatusChange);
};

const renderMemoryUsage = () => {
  const memoryNode = document.getElementById('mem');
  memoryNode.text = `Memory usage: ${memory.js.used}/${memory.js.total}`;
  memoryCounterIntervalId = setInterval(() => {
    console.log('memory update in index');
    memoryNode.text = `Memory usage: ${memory.js.used}/${memory.js.total}`;
  }, 1000);
};

const cleanUpView = () => {
  clock.granularity = 'off';
  clearInterval(weatherPollingInervalId);
  clearInterval(memoryCounterIntervalId);
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

const initPeerCommunication = () => {
  const errorNode = document.getElementById('error');
  const closeNode = document.getElementById('close');
  const cityNode = document.getElementById('location');
  const currentWeatherNode = document.getElementById('currTemp');
  const highLowTempNode = document.getElementById('highLowTemp');
  const openNode = document.getElementById('open');
  const lastMessageNode = document.getElementById('lastMessage');

  const fetchWeather = () => {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        command: 'weather'
      });
    }
  };

  messaging.peerSocket.onopen = () => {
    const date = new Date();
    openNode.text = `onopen at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    fetchWeather();
  };

  messaging.peerSocket.onmessage = ({ data }) => {
    const date = new Date();
    lastMessageNode.text = `Last message received at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    if (data) {
      // TODO: should be somehow marked that this is weather response
      cityNode.text = data.location;
      currentWeatherNode.text = `${data.temp.toFixed(0)}° ${
        data.description.charAt(0).toUpperCase() + data.description.slice(1)
      }`;
      highLowTempNode.text = `H:${data.temp_min.toFixed(0)}° L:${data.temp_max.toFixed(0)}°`;
    }
  };

  messaging.peerSocket.onerror = function (err) {
    errorNode.text = `Code: ${err.code}; ${err.message}`;
  };

  messaging.peerSocket.onclose = function (data) {
    closeNode.text = `Code: ${data.code}, WasClean: ${data.wasClean}, Time: ${new Date().toTimeString()}`;
  };

  const startWeatherPolling = () => {
    fetchWeather();
    return setInterval(fetchWeather, WEATHER_REQUEST_INTERVAL);
  }; // 30 seconds

  return startWeatherPolling;
};

// TODO: add hidden page that shows memory usage
// TODO: revise permissions that I request
// TODO: use display.poke to prolong display on time after view changing
// TODO: rewrite to just periodically send weather/calendar data from companion app?

initView();
