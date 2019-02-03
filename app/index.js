import clock from "clock";
import document from "document";
import { Barometer } from "barometer";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { today } from "user-activity";
import { vibration } from "haptics";
import { display } from "display";
import * as periodic from "../common/periodic";


//For Developing, set to false if desired.
display.autoOff = true;

//Pressure Stuff
var barom = new Barometer({ frequency: 1});
let barText = document.getElementById("bar");
barom.onreading = function() {
  barText.text = (parseInt(barom.pressure)/3386.3886).toFixed(2);
  barom.stop();
}
barom.start(); //Initial barometer reading


//Heartrate Stuff
var hrm = new HeartRateSensor();
let hrmText = document.getElementById("hrm");
hrm.onreading = function() {
  //console.log("Hart");
  hrmText.text = hrm.heartRate;
}
hrm.start();

// Update the clock every second
clock.granularity = "seconds";

//Get DOM elements
let hourHand =  document.getElementById("hours");
let minHand =   document.getElementById("mins");
let secHand =   document.getElementById("secs");
let batArc =    document.getElementById("batArc");
let stepText =  document.getElementById("steps");
let date =      document.getElementById("date");
let stairText = document.getElementById("stairs");
let tzOffSet  = document.getElementById("tzOffSet");

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = 30 * hours;           // Determine the angle at which the hand would be at 0 past the hour
  let minAngle = (0.5) * minutes;     // Determine the angle the hand would be at when taking into account the minutes
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function sixtiethToAngle(value) {
  return 6 * value;
}

// Rotate the hands every tick (and other various events that need to run every second)
function updateClock() {
  let now = new Date();
  let hours = now.getHours();
  let mins  = now.getMinutes();
  let secs  = now.getSeconds();
  let dated = now.getDate();
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours % 12, mins);
  minHand.groupTransform.rotate.angle = sixtiethToAngle(mins);
  secHand.groupTransform.rotate.angle = sixtiethToAngle(secs);
  date.text = dated;
  
  stepText.text = today.local.steps;
  stairText.text = today.local.elevationGain;
  
  //Do things once a minute
  //if (parseInt(secs) == 0)
  //Do things every 5 seconds
    if (parseInt(secs) % 5 == 0)
    {
      //console.log("doing minutely things, don't mind me...");
      barom.start();
      
      periodic.update_battery(battery,batArc);

      // Determine timezone offset, indicate if not EST
      let tz = now.getTimezoneOffset() / 60 * -1;
      tzOffSet.text = tz;
    } 
}

//Basic stuff to do once
batArc.sweepAngle = battery.chargeLevel/100 * 62;

// Draw the clock tick marks
var clockTicks = document.getElementsByClassName("clockTick");
var deg = 30;
var d = 0;
for (d = 0;d<12;d++)
  {
    clockTicks[d].groupTransform.rotate.angle = deg;
    deg += 30;
  }
// Draw the battery container (top + bottom)
var batContainerEnds = document.getElementsByClassName("batContainer");
var deg = 240;
var d = 0;
for (d = 0;d<2;d++)
  {
    batContainerEnds[d].groupTransform.rotate.angle = deg;
    deg += 60;
  }


// Update the clock every tick event
clock.ontick = () => updateClock();

// Stuff for toggling the display on/off
var centerCircle = document.getElementById("centerCircle");
var centerCircleTappable = document.getElementById("centerCircleTappable");

// Stuff for navigating between screens
let calendarScreen = document.getElementById("calendar");
let clockScreen    = document.getElementById("clock");
let countdScreen   = document.getElementById("countd");
let leftButton     = document.getElementById("toLeft");
let rightButton    = document.getElementById("toRight");

//Register tap events
centerCircleTappable.onmousedown = function(e) {
   displayToggle();
}
// Stuff for navigating between screens (Future)
/*
leftButton.onmousedown = function(e) {
   if (currentScreen == 0)
   {
     clockScreen.style.display="none";
     leftButton.style.display="none";
     countdScreen.style.display="visible";
     currentScreen = -1;
   }
   else if (currentScreen == 1)
   {
       calendarScreen.style.visibility="hidden";
       rightButton.style.visibility="visible";
       clockScreen.style.visibililty="visible";
       currentScreen = 0;
   }
  console.log("leftButton");
}
rightButton.onmousedown = function(e) {
   if (currentScreen == 0)
   {
     clockScreen.style.visibility="hidden";
     rightButton.style.visibility="hidden";
     calendarScreen.style.visibility="visible";
     currentScreen = 1;
   }
   else if (currentScreen == -1)
   {
       countdScreen.style.visibility="hidden";
       leftButton.style.visibility="visible";
       clockScreen.style.visibililty="visible";
       currentScreen = 0;
   }
  console.log("rightButton");
}
*/

// Handle center button presses

function displayToggle(){
  vibration.start("bump");
  if (display.autoOff)
    {
      console.log("Disabling display auto-off");
      centerCircle.style.fill = "#FF0000";
      display.autoOff = false;

      tzOffSet.style.opacity = parseInt("1.0");
    }
  else
    {
      console.log("Enabling display auto-off");
      centerCircle.style.fill = "fb-green";
      display.autoOff = true;

      tzOffSet.style.opacity = parseInt("0.0");
    }
}
