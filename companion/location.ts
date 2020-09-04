import { geolocation } from 'geolocation';

export const getCurrentPosition = ({ onSuccess, onError = onGetPositionError }) =>
  geolocation.getCurrentPosition(onSuccess, onError, { timeout: 60 * 1000 });

const onGetPositionError = (error) => {
  console.log('Error: ' + error.code, 'Message: ' + error.message);
};
