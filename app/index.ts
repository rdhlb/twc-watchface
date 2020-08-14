import * as messaging from 'messaging';
import document from 'document';

import './memoryMonitor';
import './clock';
import { processWeatherData } from './weather';

// TODO: add hidden page that shows memory usage
// TODO: revise permissions that I request
const errorNode = document.getElementById('error');
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
