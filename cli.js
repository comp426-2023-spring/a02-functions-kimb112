#!/usr/bin/env node

import minimist from "minimist";
import moment from "moment-timezone";
import fetch from "node-fetch";

const minimist = require('minimist')

const args = minimist(process.argv.slice(2));

//if item at command line is -h
if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
  -h            Show this help message and exit.
  -n, -s        Latitude: N positive; S negative.
  -e, -w        Longitude: E positive; W negative.
  -z            Time zone: uses tz.guess() from moment-timezone by default.
  -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
  -j            Echo pretty JSON from open-meteo API and exit.`) 
  process.exit(0); 
}

const timezone_guess = moment.tz.guess();

let latitude;
let longitude;
let timezone;

if (args.n && args.n > 0) {
    latitude = args.n;
}
if (args.s && args.s > 0) {
    latitude = -args.s;
}

if (args.e && args.e > 0) {
    longitude = args.e;
}
if (args.w && args.w > 0) {
    longitude = -args.w;
}

if (args.z) {
    timezone = args.z;
} else {
    timezone = timezone_guess;
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&timezone=' + timezone);

const data = await response.json();

const days = args.d 

if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}

process.exit(0);
