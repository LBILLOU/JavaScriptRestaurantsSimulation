'use strict';

const chalk = require('chalk');

var Market = require('./market.js');
var Restaurant = require('./crc.js');
var Clock = require('./crc.js');
const numberOfRestaurants = Restaurant.numberOfRestaurants;

//Creating clock
var mainClock = new Clock.clock();
//Change to the following for testing Unit Tests
//var mainClock = new Clock.constructor;

// Creating market
new Market.market();
console.log(chalk.magenta('*** Market ***'));

// Creating restaurants
for (var x = 0; x < numberOfRestaurants; x++) {
  var workinghours = [];
  workinghours.push(Math.floor(5 * Math.random()) + 6); // Opening 6-10h
  workinghours.push(Math.floor(4 * Math.random()) + 21); // Closing 21-24h
  var seats = Math.floor(5 * Math.random()) + 2; // Seats 2-6
  var restaurant = new Restaurant.restaurant(x, workinghours, seats);
  console.log(chalk.yellow('*** Restaurant n°' + restaurant.id + ' ***'));
  console.log(chalk.yellow('Working Hours : ' + restaurant.hours));
  console.log(chalk.yellow('Number of seats : ' + restaurant.seats));
  console.log(chalk.yellow('Stocks : ' + restaurant.ingredients));
  Restaurant.listOfRestaurants.push(restaurant);
}

module.exports.mainClock = mainClock;
