import document from "document";
import clock from "clock";
import { memory } from "system";
console.log("JS memory: " + memory.js.used + "/" + memory.js.total);

let myClock = document.getElementById("clock");

clock.granularity = 'minutes';

clock.ontick = function(evt) {
  myClock.text = ("0" + evt.date.getHours()).slice(-2) + ":" + ("0" + evt.date.getMinutes()).slice(-2);
};
