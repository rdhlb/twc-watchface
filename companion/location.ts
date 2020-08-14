import { geolocation } from "geolocation";

export const getCurrentPosition = ({ onSuccess, onError }) => geolocation.getCurrentPosition(onSuccess, onError, { timeout: 60 * 1000 });