// Import the messaging module
import * as messaging from 'messaging';

import { getCurrentPosition } from './location';
import { queryOpenWeather } from './weather';

// TODO: add prettier

// Send the weather data to the device
function returnWeatherData(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send a command to the device
    messaging.peerSocket.send(data);
  } else {
    console.log('Error: Connection is not open');
  }
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function (evt) {
  if (evt.data && evt.data.command == 'weather') {
    getCurrentPosition({ onSuccess: locationSuccess, onError: locationError });
  }
};

// Listen for the onerror event
messaging.peerSocket.onerror = function (err) {
  // Handle any errors
  console.log('Connection error: ' + err.code + ' - ' + err.message);
};

function locationSuccess(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  queryOpenWeather({
    options: { location: { lon, lat } },
    onSuccess: returnWeatherData
  });
}

function locationError(error) {
  console.log('Error: ' + error.code, 'Message: ' + error.message);
}
