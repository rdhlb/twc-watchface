import { OPENWEATHERMAP_API_KEY, OPENWEATHERMAP_ENDPOINT } from '../common/constants';

export const queryOpenWeather = ({ options, onSuccess }) => {
  const locationQuery = `?lat=${options.location.lat}&lon=${options.location.lon}`;
  const URL = OPENWEATHERMAP_ENDPOINT + locationQuery + '&units=metric' + '&APPID=' + OPENWEATHERMAP_API_KEY;
  console.log(URL);
  fetch(URL)
    .then(function (response) {
      response.json().then(function (data) {
        console.log(JSON.stringify(data, null, 1));
        onSuccess({
          ...data.main,
          city: data.name,
          description: data.weather?.[0]?.description
        });
      });
    })
    .catch(function (err) {
      console.log('Error fetching weather: ' + err);
    });
};
