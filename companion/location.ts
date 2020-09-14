import { geolocation } from 'geolocation';

export const getCurrentPosition = (): Promise<Position> =>
  new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(resolve, reject, { timeout: 60 * 1000 });
  });
