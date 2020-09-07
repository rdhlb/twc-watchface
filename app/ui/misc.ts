import document from 'document';

import { getTimeString, getDate, getDayShort } from '../utils';

export const renderClock = (date) => {
  const container = document.getElementById('clock');
  container.text = getTimeString(date);
};

export const renderDateAndDay = (date) => {
  const dayOfWeekNode = document.getElementById('dayOfWeek');
  const currentDateNode = document.getElementById('currentDate');

  dayOfWeekNode.text = getDayShort(date).toUpperCase();
  currentDateNode.text = String(getDate(date));
};
