import { memory } from 'system';
import { DAYS_SHORT } from '../common/constants';

export const startMemoryMonitoring = (render, interval = 1000) =>
  setInterval(() => {
    render(memory.js.used, memory.js.total);
  }, interval);

export const stopMemoryMonitoring = (intervalId) => clearInterval(intervalId);

const formatWithLeadingZero = (num: number, digitsQty = 2) => `0${num}`.slice(-digitsQty);

export const getTimeString = (date: Date) =>
  [date.getHours(), date.getMinutes()].map((value) => formatWithLeadingZero(value)).join(':');

export const getCurrentDay = () => DAYS_SHORT[new Date().getDay()];

export const getCurrentDate = () => new Date().getDate();
