export const WEATHER_API_ENDPOINT = 'https://eeompdabjg.execute-api.us-east-1.amazonaws.com/Prod/weather';
export const COMMUNICATION_ACTIONS = {
  WEATHER_REQUEST: 'weather_request',
  WEATHER_RESPONSE: 'weather_response',
  CALENDAR_EVENTS_REQUEST: 'calendar_events_request',
  CALENDAR_EVENTS_RESPONSE: 'calendar_events_response',
  CHANGE_SETTINGS: 'change_settings'
};
export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEATHER_REQUEST_INTERVAL = 60 * 1000 * 60;
export const CALENDAR_REQUEST_INTERVAL = 15 * 1000 * 60;
export const WEATHER_RESPONSE_TIMEOUT = 15 * 1000;
export const FITBIT_WEATHER_APP_UUID = '000013fe-0000-4000-8000-000000f17b17';
export const FITBIT_AGENDA_APP_UUID = '9646a9da-fdef-47ba-81a2-a1f6f82c101c';
