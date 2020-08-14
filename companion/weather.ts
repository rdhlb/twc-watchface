import { OPENWEATHERMAP_API_KEY, OPENWEATHERMAP_ENDPOINT } from '../common/constants';

type OptionsType = {
  lat: number;
  lon: number;
  units?: 'metric' | 'imperial';
};

export const queryOpenWeather = ({ options, onSuccess }: { options: OptionsType; onSuccess: (any) => void }) => {
  const locationQuery = `?lat=${options.lat}&lon=${options.lon}`;
  const URL = OPENWEATHERMAP_ENDPOINT + locationQuery + '&units=metric' + '&APPID=' + OPENWEATHERMAP_API_KEY;
  console.log(URL);
  fetch(URL)
    .then(function (response) {
      response.json().then(function (data) {
        console.log(JSON.stringify(data, null, 1));
        onSuccess({
          ...data.main,
          location: data.name,
          description: data.weather?.[0]?.description
        });
      });
    })
    .catch(function (err) {
      console.log('Error fetching weather: ' + err);
    });
};
