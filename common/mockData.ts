import { WeatherResponseDataType } from './types';

export const mockWeatherData: WeatherResponseDataType = {
  locationName: 'Mock City',
  dailyForecastTemp: {
    min: 30,
    max: 40
  },
  currentConditions: {
    temp: 31,
    description: "It's a hell!"
  }
};
