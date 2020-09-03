import { memory } from 'system';
import { vibration } from 'haptics';

import { DAYS_SHORT } from '../common/constants';

export const startMemoryMonitoring = (render, interval = 1000) =>
  setInterval(() => {
    console.log('memory monitoring callback');
    render(memory.js.used, memory.js.total);
  }, interval);

export const stopMemoryMonitoring = (intervalId) => clearInterval(intervalId);

const formatWithLeadingZero = (num: number, digitsQty = 2) => `0${num}`.slice(-digitsQty);

export const getTimeString = (date: Date) =>
  [date.getHours(), date.getMinutes()].map((value) => formatWithLeadingZero(value)).join(':');

export const getDayShort = (date: Date) => DAYS_SHORT[date.getDay()];

export const getDate = (date: Date) => date.getDate();

export const startPolling = (fn, interval) => {
  fn();
  return setInterval(fn, interval);
};

export const handleLongPress = (el, callback, options = { timeout: 1500 }) => {
  let longPressTimeoutId;

  el.onmousedown = () => {
    longPressTimeoutId = setTimeout(() => {
      vibration.start('bump');
      callback();
    }, options.timeout);
  };

  el.onmouseup = () => {
    clearTimeout(longPressTimeoutId);
    longPressTimeoutId = null;
  };
};
