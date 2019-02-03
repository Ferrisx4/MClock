// This file contains all functions that need to be run in periodic intervals
// To-do
//  - Figure out whether to have UI elements or variables passed to these functions
//    or if these functions should just return the value and let the UI elements be altered
//    in the origin (i.e. index.js)

export function update_battery(battery, batArc)
{
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