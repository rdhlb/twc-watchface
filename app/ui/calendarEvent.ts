import { getTimeString } from '../utils';

import document from 'document';

class CalendarEventComponent {
  calendarEventTimeNode: Element;
  calendarEventDescriptionNode: Element;

  constructor() {
    this.calendarEventTimeNode = document.getElementById('calendarEventTime');
    this.calendarEventDescriptionNode = document.getElementById('calendarEventDescription');
  }

  render = ({ title, start, end }) => {
    this.calendarEventTimeNode.text = `${getTimeString(start)}-${getTimeString(end)}`;
    this.calendarEventDescriptionNode.text = title;
  };
}

export default CalendarEventComponent;
