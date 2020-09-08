import { WEATHER_API_ENDPOINT } from '../common/constants';
import { WeatherResponseDataType } from '../common/types';

export const fetchWeather = async (coords: {
  latitude: number;
  longitude: number;
}): Promise<WeatherResponseDataType> => {
  const lat = coords.latitude;
  const lon = coords.longitude;

  const query = `?coordinates=${lat},${lon}&units=metric`;
  const URL = WEATHER_API_ENDPOINT + query;
  const response = await fetch(URL);

  if (!response.ok) {
    throw new Error(`Error getting weather data from server. Code: ${response.status}`);
  }

  return await response.json();
};
