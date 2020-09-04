import { memory } from 'system';
import { vibration } from 'haptics';
import document from 'document';

import { DAYS_SHORT } from '../common/constants';

export const startMemoryMonitoring = (render, interval = 1000) =>
  setInterval(() => {
    render(memory.js.used, memory.js.total);
  }, interval);

export const stopMemoryMonitoring = (intervalId) => clearInterval(intervalId);

const formatWithLeadingZero = (num: number, digitsQty = 2) => `0${num}`.slice(-digitsQty);

export const getTimeString = (date: Date, { format = 'short' }: { format: 'short' | 'long' } = { format: 'short' }) => {
  const timeShortParts = [date.getHours(), date.getMinutes()];

  return (format === 'short' ? timeShortParts : timeShortParts.concat(date.getSeconds()))
    .map((value) => formatWithLeadingZero(value))
    .join(':');
};

export const getDayShort = (date: Date) => DAYS_SHORT[date.getDay()];

export const getDate = (date: Date) => date.getDate();

export const startPolling = (fn, interval) => {
  fn();
  return setInterval(fn, interval);
};

export const handleLongPress = (el: Element, callback, options = { timeout: 1500 }) => {
  let longPressTimeoutId;

  el.onmousedown = () => {
    longPressTimeoutId = setTimeout(() => {
      vibration.start('bump');
      callback();
    }, options.timeout);
  };

  el.onmouseout = () => {
    clearTimeout(longPressTimeoutId);
  };

  el.onmouseup = () => {
    clearTimeout(longPressTimeoutId);
  };
};

export const findByIdAndRender = (id: string, text: string) => {
  const container = document.getElementById(id);
  container.text = text;

  return container;
};

export const capitalizeFirstLetter = ([first, ...rest], locale = 'en') => {
  return [first.toLocaleUpperCase(locale), ...rest].join('');
};

export const delay = (cb, timeout) =>
  setTimeout(() => {
    cb();
  }, timeout);
