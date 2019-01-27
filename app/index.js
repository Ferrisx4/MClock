import clock from "clock";
import document from "document";
import { Barometer } from "barometer";
import { HeartRateSensor } from "heart-rate";
import { battery } from "power";
import { today } from "user-activity";
import { vibration } from "haptics";
import { display } from "display";
import * as utils from "../common/utils";


//For Developing
//display.autoOff = false;

//Various Variables
var longTouch = false;  //For registering long-tap events
var expireTouch = false;
//var touchStart = 0;
var currentScreen = 0;


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

// Update the clock every second
clock.granularity = "seconds";

//Get DOM elements
let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
let secHand = document.getElementById("secs");
let batBar = document.getElementById("bat");
let batArc = document.getElementById("batArc");
let stepText = document.getElementById("steps");
let date = document.getElementById("date");
let stairText = document.getElementById("stairs");

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick (and other various events that need to run every second)
function updateClock() {
  let now = new Date();
  let hours = now.getHours();
  let mins  = now.getMinutes();
  let secs  = now.getSeconds();
  let dated = now.getDate();
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours % 12, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
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
      
      let batteryLevel = battery.chargeLevel;
      console.log("Battery level: " + batteryLevel);
      if (batteryLevel < 10)
        {
          batArc.style.fill = "fb-red";
          console.log("Battery low, setting indicator to red");
        }
      else if(batteryLevel < 25)
      {
          batArc.style.fill = "fb-yellow";
          console.log("Battery somewhat low, setting indicator to yellow");
      }
      else
        {
          batArc.style.fill = "fb-green";
          console.log("Battery nominal, setting indicator to green");
        }
      batArc.sweepAngle = battery.chargeLevel/100 * 62;
    }
  // Test for changing gradient (every other second)
  let faceGradient = document.getElementById("faceGradient");
  if (parseInt(secs) % 2 == 0)
     {
       //faceGradient.gradient-color1 = "black";
     }
  else
    {
       //faceGradient.gradient-color1 = "white";  
    }
  
  
  hrm.start();
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

 
function displayToggle(){
  vibration.start("bump");
  console.log("Toggling display auto-off");
  if (display.autoOff)
    {
      centerCircle.style.fill = "#FF0000";
      display.autoOff = false;
    }
  else
    {
      centerCircle.style.fill = "fb-green";
      display.autoOff = true;
    }
}
