import { memory } from 'system';

export const startMemoryMonitoring = (render, interval = 1000) =>
  setInterval(() => {
    render(memory.js.used, memory.js.total);
  }, interval);

export const stopMemoryMonitoring = (intervalId) => clearInterval(intervalId);
