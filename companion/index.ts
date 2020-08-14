import * as messaging from 'messaging';

import { getCurrentPosition } from './location';
import { queryOpenWeather } from './weather';
import { COMM_COMMANDS } from '../common/constants';

const returnWeatherData = (data) => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('Error: Connection is not open');
  }
};

messaging.peerSocket.onmessage = function (evt) {
  if (evt.data?.command == COMM_COMMANDS.WEATHER) {
    getCurrentPosition({ onSuccess: queryWeatherData, onError: onGetPositionError });
  }
};

messaging.peerSocket.onerror = function (err) {
  console.log('Connection error: ' + err.code + ' - ' + err.message);
};

const queryWeatherData = (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  queryOpenWeather({
    options: { lat, lon },
    onSuccess: returnWeatherData
  });
};

const onGetPositionError = (error) => {
  console.log('Error: ' + error.code, 'Message: ' + error.message);
};
