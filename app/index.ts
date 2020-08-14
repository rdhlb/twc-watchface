import { memory } from 'system';
import * as messaging from 'messaging';
import { display } from 'display';

import './clock';
import { processWeatherData } from './weather';
import document from 'document';

// TODO: add hidden page that shows memory usage
// TODO: find out how to move lines with keyboard
// TODO: revise permissions that I request

const memoryNode = document.getElementById('mem');
const errorNode = document.getElementById('error');
let memoryIntervalId = null;

display.addEventListener('change', () => {
  console.log(display.on, memoryIntervalId);
  if (display.on) {
    memoryIntervalId = setInterval(() => {
      memoryNode.text = `Memory usage: ${memory.js.used}/${memory.js.total}`;
    }, 1000);
  } else {
    clearInterval(memoryIntervalId);
  }
});

const startWeatherPolling = () => setInterval(fetchWeather, 5 * 1000 * 60); // 5 minutes

function fetchWeather() {
  messaging.peerSocket.send({
    command: 'weather'
  });
}

messaging.peerSocket.onopen = function () {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    fetchWeather();
  }
};

messaging.peerSocket.onmessage = function (evt) {
  if (evt.data) {
    // TODO: should be somehow marked that this is weather response
    processWeatherData(evt.data);
  }
};

messaging.peerSocket.onerror = function (err) {
  console.log('Connection error: ' + err.code + ' - ' + err.message);
  errorNode.text = err.message;
};

startWeatherPolling();
