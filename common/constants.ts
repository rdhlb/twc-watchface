export const OPENWEATHERMAP_API_KEY = 'e5a35a44e8171103e277436a42e8c4be';
export const OPENWEATHERMAP_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
export const COMMUNICATION_ACTIONS = {
  WEATHER_REQUEST: 'weather_request',
  WEATHER_RESPONSE: 'weather_response',
  CALENDAR_EVENTS_REQUEST: 'calendar_events_request',
  CALENDAR_EVENTS_RESPONSE: 'calendar_events_response',
  CHANGE_SETTINGS: 'change_settings'
};
export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEATHER_REQUEST_INTERVAL = 15 * 1000 * 60;
export const CALENDAR_REQUEST_INTERVAL = 15 * 1000 * 60;
export const WEATHER_RESPONSE_TIMEOUT = 15 * 1000;
