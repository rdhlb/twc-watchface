import { memory } from 'system';

export const startMemoryMonitoring = (render, interval = 1000) =>
  setInterval(() => {
    render(memory.js.used, memory.js.total);
  }, interval);

export const stopMemoryMonitoring = (intervalId) => clearInterval(intervalId);

const formatWithLeadingZero = (num: number, digitsQty = 2) => `0${num}`.slice(-digitsQty);

export const getTimeString = (date: Date) =>
  [date.getHours(), date.getMinutes()].map((value) => formatWithLeadingZero(value)).join(':');
