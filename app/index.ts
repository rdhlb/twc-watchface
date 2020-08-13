import document from "document";
import clock from "clock";
import { memory } from "system";

let myClock = document.getElementById("clock");

clock.granularity = 'minutes';

// TODO: add hidden page that shows memory usage

clock.ontick = function(evt) {
  const hours = evt.date.getHours();
  const minutes = evt.date.getMinutes();
  myClock.text = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
};