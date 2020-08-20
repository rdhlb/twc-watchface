import document from 'document';
import { memory } from 'system';
import { display } from 'display';

let memoryCounterIntervalId;

const onDisplayStatusChange = () => {
  console.log('display change event in calendar');
  if (!display.on) {
    clearInterval(memoryCounterIntervalId);
  } else {
    renderMemoryUsage();
  }
};

const renderMemoryUsage = () => {
  const memoryNode = document.getElementById('mem');
  memoryNode.text = `Memory usage: ${memory.js.used}/${memory.js.total}`;
  memoryCounterIntervalId = setInterval(() => {
    console.log('memory interval');
    memoryNode.text = `Memory usage: ${memory.js.used}/${memory.js.total}`;
  }, 1000);
};

export const initView = ({ back }) => {
  const button = document.getElementById('button');
  button.addEventListener('click', onBackButtonClick(back));

  console.log(`location: ${document.location.pathname}`);
  renderMemoryUsage();
  display.addEventListener('change', onDisplayStatusChange);
};

const onBackButtonClick = (back) => () => {
  back();
  cleanUpCalendarView();
};

const cleanUpCalendarView = () => {
  clearInterval(memoryCounterIntervalId);
  display.removeEventListener('change', onDisplayStatusChange);
};
