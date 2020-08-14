import { memory } from 'system';
import { display } from 'display';
import document from 'document';

const memoryNode = document.getElementById('mem');
let memoryIntervalId = null;

display.addEventListener('change', () => {
  console.log(display.on, memoryIntervalId);
  if (display.on) {
    memoryIntervalId = setInterval(() => {
      memoryNode.text = `Memory usage: ${memory.js.used}/${memory.js.total}`;
    }, 1000);
  } else {
    clearInterval(memoryIntervalId);
  }
});
