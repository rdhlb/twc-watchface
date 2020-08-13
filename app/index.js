import document from "document";
import clock from "clock";

let myClock = document.getElementById("myClock");

clock.granularity = 'seconds'; // seconds, minutes, hours

clock.ontick = function(evt) {
  myClock.text = ("0" + evt.date.getHours()).slice(-2) + ":" +
                      ("0" + evt.date.getMinutes()).slice(-2) + ":" +
                      ("0" + evt.date.getSeconds()).slice(-2);
};

let demo = document.getElementById("demo");
// demo.style.display = "none";
// demo.style.display = "inline";

// Toggle Show/Hide
function toggle(ele) {
  ele.style.display = (ele.style.display === "inline") ? "none" : "inline";
}

toggle(demo);

setTimeout(() => {
  toggle(demo);
}, 1000);