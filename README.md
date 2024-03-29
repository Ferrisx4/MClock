# MClock - A Fitbit Ionic Watch Face

# DO NOT USE YOUR FITBIT IONIC
Fitbit has issued a recall for all Ionic devices. Click [here](https://help.fitbit.com/en_US/ionic.htm) for information on how to return it and possible refunds and discounts.
# DO NOT USE YOUR FITBIT IONIC

## Description
The MClock (Midspin Clock) is a very basic simulated analog watch face.
It features subtle design and basic information.

By tapping on the center of the watch face (green circle), the display will be set to not auto-sleep. The center will turn red. 

To re-enable display auto-sleep, tap the center again.

## Live stats
* Upper Right: Atmospheric pressure sensor reading - inHg
* Lower Right:
  * Upper: Floors climbed today
  * Lower: Steps taken today
* Lower Left: Current heartrate (with resting heart rate in parenthesis) - measured in Beats Per Minute

These items do not have labels or units displayed. This is an intended design aspect; each of the datapoints can be divined through context or familiarity.

## Installation
The recommended way to get this watch face on your device is to clone the repository and [follow these instructions](https://dev.fitbit.com/build/guides/command-line-interface/)

If you don't have a suitable development environment and want to use the watch face as-is, import the files into a new project on [Fitbit Studio](https://studio.fitbit.com)

## Screenshot
![Current Screenshot](https://github.com/Ferrisx4/MClock/blob/master/MClock%20Screenshot.png)

Fitbit Ionic

## To-do
- [x] Show timezone offset (currently default to EST)
- [ ] Settings
  - [ ] Colors
  - [ ] Default timezone
  - [ ] Atmospheric pressure units
  - [ ] Which datapoints to be shown and when
    * Always show
    * Only in 'always-on' mode
    * Never
- [ ] Make code a little more organized
- [ ] Calendar screen to visualize this month's calendar
- [ ] Extended Date/time screen (week number, day of year, % of year progress)
- [ ] Versa compatibility
