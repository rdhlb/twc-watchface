import * as messaging from 'messaging';
import document from 'document';
import { me as device } from 'device';

import './memoryMonitor';
import './clock';
import { processWeatherData } from './weather';

// TODO: add hidden page that shows memory usage
// TODO: revise permissions that I request

// TODO: rewrite to just periodically send weather/calendar data from companion app?

const errorNode = document.getElementById('error');
const openNode = document.getElementById('open');
const closeNode = document.getElementById('close');
const lastMessageNode = document.getElementById('lastMessage');
const lastSyncTimeNode = document.getElementById('lastSyncTime');
const startWeatherPolling = () => setInterval(fetchWeather, 5 * 1000 * 60); // 5 minutes
let lastTime = Date.now();

function fetchWeather() {
  const time = new Date();
  lastMessageNode.text = `fetchWeather(). ${messaging.peerSocket.bufferedAmount}, ${
    messaging.peerSocket.readyState === messaging.peerSocket.OPEN
  }, ${time.getMinutes()}:${time.getSeconds()}`;
  lastSyncTimeNode.text = `${device.lastSyncTime?.toString()}`;

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    lastMessageNode.text = 'peerSocket in Open state';
    messaging.peerSocket.send({
      command: 'weather'
    });
  }
}

messaging.peerSocket.onopen = function () {
  openNode.text = 'onopen';
  fetchWeather();
};

messaging.peerSocket.onmessage = function (evt) {
  const messageTime = Date.now();
  const minutesSince = (messageTime - lastTime) / 1000 / 60;
  lastTime = messageTime;
  lastMessageNode.text = `Last message received ${minutesSince.toFixed(2)} min ago.`;
  if (evt.data) {
    // TODO: should be somehow marked that this is weather response
    processWeatherData(evt.data);
  }
};

messaging.peerSocket.onerror = function (err) {
  errorNode.text = err.code + ' ' + err.message;
};

messaging.peerSocket.onclose = function (data) {
  closeNode.text = `${data.code} - ${data.wasClean}`;
};

startWeatherPolling();
