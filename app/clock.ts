import document from "document";
import clock from "clock";

// TODO: handle AM/PM setting
// TODO: refactor ontick function (rethink slices)

let myClock = document.getElementById("clock");

clock.granularity = 'minutes';

clock.ontick = function(evt) {
  const hours = evt.date.getHours();
  const minutes = evt.date.getMinutes();
  myClock.text = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2);
};

export default clock;