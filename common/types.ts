export type WeatherResponseDataType = {
  locationName: string;
  currentConditions: {
    description: string;
    temp: number;
  };
  dailyForecastTemp: {
    min: number;
    max: number;
  };
};
