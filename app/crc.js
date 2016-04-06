'use strict';

// C.R.C. -> Clock, Restaurant, Client

const chalk = require('chalk');
var Market = require('./market.js');
var mainClock = require('./main.js');
const EventEmitter = require('events').EventEmitter;
const ev = new EventEmitter();
ev.setMaxListeners(20); // Setting max to 20 (cf. ev.on('createClients'))

// Simulation settings
const daysOfSimulation = 1; // Days of simulation
const msForMinute = 15; // Milliseconds for one minute in simulation
const rushHourStockValueCheck = 5; // If stocks <= value, go to market
const marketRefuelValue = 8; //Market refueling value for each ingredient
const numberOfRestaurants = 3; // Is exported to main
const tryAnother = 15; // Time for client to try another restaurant
const chanceOfRobberyEveryHour = 0.01; // Rate of robbery chance every hour

var listOfRestaurants = []; // Creating list for restaurants
var listOfClients = []; // Creating list for clients
const ingredientsNumber = 3; // Number of ingredients in stocks Export for TESTS
const numberOfRecipes = 3; // Number of recipe of restaurants Export for TESTS

// Clock class
class Clock {
  /**
   * Construct a Clock
   */
  constructor() {
    this.minute = 0; // Number of minutes of clock
    this.hour = 23; // Number of hours of clock
    this.day = 0; // Number of days of clock
    // Launch clock minute++ every 'simulation minute time'
    this.whatTimeIsIt = setInterval(() => {this.runClock();
    }, msForMinute);
  }
  // Function to operate clock
  runClock() {
    this.minute++;
    // If minutes get to 60 -> set minutes to 0 and add 1 hour
    if (this.minute == 60) {
      this.minute = 0;
      this.hour++;
      // Check if restaurants open or close
      ev.emit('restaurantOpenClose', this.hour);
      // If hours get t0 24 -> set hours to 0 and add 1 day
      if (this.hour == 24) {
        this.hour = 0;
        this.day++;
        console.log(chalk.blue('*** Day ' + this.day + ' ***'));
        console.log(chalk.cyan('*** SCOREBOARD ***'));
        // Print scoreboard at the end each day
        ev.emit('scoreboard');
      }
      console.log(chalk.blue(this.hour + ':00'));
      // If it is 5:00 -> open the market
      if (this.hour == 5) {
        Market.market.isOpen = true;
        console.log(chalk.magenta(this.hour + ':00 Market is opened.'));
      }
      // If it is 12:00 -> tell it is rush hour (lots of clients)
      if (this.hour == 12) {
        console.log(chalk.red(this.hour +
          ':00 *** Rush Hour ***'));
      }
      // If it is 14:00 -> close the market
      if (this.hour == 14) {
        Market.market.isOpen = false;
        console.log(chalk.magenta(this.hour + ':00 Market is closed.'));
      }
      // If it is 19:00 -> tell it is rush hour (lots of clients)
      if (this.hour == 19) {
        console.log(chalk.red(this.hour +
          ':00 *** Rush Hour ***'));
      }
      // If simulation comes to the defined end in days -> end simulation
      if (this.day == daysOfSimulation + 1) {
        clearInterval(this.whatTimeIsIt);
        console.log(chalk.blue('END OF SIMULATION'));
      }
      // Calling event to create a robbery
      ev.emit('callThePolice', chanceOfRobberyEveryHour);
    }
    // Create clients, different affluence depending on time
    if (this.hour == 6) {
      this.clientCreation(0.1, 30);
    } else if (this.hour == 7) {
      this.clientCreation(0.1, 30);
    } else if (this.hour == 8) {
      this.clientCreation(0.2, 20);
    }else if (this.hour == 9) {
      this.clientCreation(0.2, 10);
    }else if (this.hour == 10) {
      this.clientCreation(0.3, 10);
    } else if (this.hour == 11) {
      this.clientCreation(0.4, 10);
      // Tell restaurants to check stocks before lunch rush hour
      if (!this.minute) {
        ev.emit('checkStock');
      }
    }else if (this.hour == 12) {
      this.clientCreation(0.5, 3);
    } else if (this.hour == 13) {
      this.clientCreation(0.5, 5);
      // Tell restaurants to check stocks before market closes
      if (this.minute == 55) {
        ev.emit('checkStock');
      }
    } else if (this.hour == 14) {
      this.clientCreation(0.4, 10);
    } else if (this.hour == 15) {
      this.clientCreation(0.2, 20);
    } else if (this.hour == 16) {
      this.clientCreation(0.2, 20);
    } else if (this.hour == 17) {
      this.clientCreation(0.2, 20);
    } else if (this.hour == 18) {
      this.clientCreation(0.2, 20);
    } else if (this.hour == 19) {
      this.clientCreation(0.4, 10);
    } else if (this.hour == 20) {
      this.clientCreation(0.5, 5);
    } else if (this.hour == 21) {
      this.clientCreation(0.5, 3);
    } else if (this.hour == 22) {
      this.clientCreation(0.5, 6);
    }else if (this.hour == 22) {
      this.clientCreation(0.2, 10);
    }
  }
  // Function to create client while clock is running.
  // For defined frequency and possibility of occurrence -> create a new client
  clientCreation(chanceOfCreation, frequencyInMinutes) {
    if (this.minute % frequencyInMinutes === 0) {
      if (Math.random() < chanceOfCreation) {
        ev.emit('createClients');
      }
    }
  }
}

// Creating clock
//var timeClock = new Clock();

// Restaurant class
class restaurant{
  /**
   * Construct a Restaurant
   * @param {int} id - Specific an unique ID for the restaurant
   * @param {[int]} hours - Opening and closing hours ex:[6, 22]
   * @param {int} seats - Number of seats of the restaurant
     */
  constructor(id, hours, seats) {
    this.id = id; // Identification number of restaurant
    this.isOpen = false; // Boolean to tell if restaurant is opened or not
    this.hours = hours; // Restaurant's opening and closing hours
    this.clients = 0; // Number of clients currently in restaurant
    this.seats = seats; // Number of seats of restaurant
    this.ingredients = [10,10,10]; // Starting Stocks for every restaurant
    this.recipes = [[1, 1, 0], [0, 1, 1], [1, 0, 1]]; // Recipes of restaurant
    this.score = 0; // General score of restaurant
    this.dayPoints = 0; // Points of the day of restaurant
    // Event to print restaurant's opening and closing hours.
    ev.on('restaurantOpenClose', (hour)=> {
      if (hour == this.hours[0]) {
        this.isOpen = true;
        console.log(chalk.yellow(mainClock.mainClock.hour + ':00 ' +
          'Restaurant ' + this.id + ' is opened.'));
        ev.emit('checkStockZero');
      }
      if (hour == this.hours[1]) {
        this.isOpen = false;
        console.log(chalk.yellow(mainClock.mainClock.hour + ':00 ' +
          'Restaurant ' + this.id + ' is closed.'));
      }
    });
    // Event to check whether restaurant is opened.
    ev.on('isRestaurantOpened', (idClient, restaurantNumber, recipeNumber)=> {
      // For chosen restaurant, if opened and not full
      if (this.id == restaurantNumber && this.isOpen &&
        this.clients < this.seats) {
        // Check if chosen recipe can be cooked
        if (this.canRecipeBeCooked(recipeNumber)) {
          console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
            this.id + ' : Yes, please come in.' + '(' + this.clients +
            '/' + this.seats + ')'));
          // Increase client number of restaurant
          this.clients++;
          // Taking recipe's ingredients out of restaurant ingredient stocks
          for (var x = 0; x < this.ingredients.length; x++) {
            this.ingredients[x] -= this.recipes[recipeNumber][x];
          }
          // Wait for restaurant to cook recipe
          ev.emit('waitForCooking', idClient, restaurantNumber,
            this.ingredients);
         // If recipe cannot be cooked
        } else {
          console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
            this.id + ' : Sorry we need to go to the market.' +
            '(' + this.ingredients + ')'));
          // Send restaurant to the market to get ingredients
          this.goToMarket(restaurantNumber);
          // Tell client to retry another restaurant
          ev.emit('retryRestaurant', idClient);
        }
      // For chosen restaurant, if opened but full
      } else if (this.id == restaurantNumber && this.isOpen &&
        this.clients == this.seats) {
        console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
          this.id + ' : Sorry we are full.' + '(' + this.clients +
          '/' + this.seats + ')'));
        // Tell client to retry another restaurant
        ev.emit('retryRestaurant', idClient);
      // For chosen restaurant, if closed
      } else {
        if (this.id == restaurantNumber && !this.isOpen) {
          console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
            this.id + ' : Sorry we are closed.'));
          // Tell client to retry another restaurant
          ev.emit('retryRestaurant', idClient);
        }
      }
    });
    // Event to add client's score and to update client number
    ev.on('clientIsLeaving', (restaurantNumber, points)=> {
      if (this.id == restaurantNumber) { //For chosen restaurant
        this.dayPoints += points; // Add points to points of the day
        this.clients -= 1; // Decrease client number by 1
        console.log(chalk.yellow(this.localTime() + ' Restaurant ' + this.id +
          ' : Thank you for coming, see you soon!'));
      }
    });
    // Event to print scoreboard/restaurant's stats
    ev.on('scoreboard', () => {
      this.score += this.dayPoints * (24 - (this.hours[1] - this.hours[0]));
      console.log(chalk.cyan(this.localTime() + ' Restaurant ' +
        this.id + ', Score = ' + this.score + ', Stocks = ' +
        this.ingredients + ', Number of seats : ' + this.seats +
        ', Opening hours : ' + this.hours[0] + 'h-' + this.hours[1] + 'h.'));
    });
    // Event to check every restaurant's stocks before rush hour
    ev.on('checkStock', () => {
      for (var x = 0; x < numberOfRestaurants; x++) {
        if (this.id == x) {
          for (var y = 0; y < ingredientsNumber; y++) {
            if (this.ingredients[y] <= rushHourStockValueCheck) {
              console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
                this.id +
                ' : We must go to the market before next rush hour!'));
              this.goToMarket(x);
              break;
            } else {
              console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
                this.id +
                ' : We have enough ingredients in stock for next rush hour.'));
              break;
            }
          }
        }
      }
    });
    // Event to check any restaurant is missing any ingredient
    ev.on('checkStockZero', () => {
      for (var x = 0; x < numberOfRestaurants; x++) {
        if (this.id == x) {
          for (var y = 0; y < ingredientsNumber; y++) {
            if (this.ingredients[y] <= 0) {
              console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
                this.id +
                ' : We must go to the market we are missing ingredients!' +
                '(' + this.ingredients + ')'));
              this.goToMarket(x);
              break;
            }
          }
        }
      }
    });
    // Event to create a robbery
    ev.on('callThePolice', (chanceOfCreation) => {
      var robbery = Math.random();
      if (robbery < chanceOfCreation) {
        var restaurantToRob = Math.floor((listOfRestaurants.length) *
          Math.random());
        if (this.id == restaurantToRob) {
          if (this.isOpen) {
            console.log(chalk.red(this.localTime() + ' *** GANG ROBBERY ***'));
            console.log(chalk.red(this.localTime() + ' Restaurant ' + this.id +
              ' : Everybody on the ground! Stay calm and do what I say!'));
            console.log(chalk.red(this.localTime() + ' Restaurant ' + this.id +
              ' : Please someone call the police! Help! Help!'));
            if (robbery < (chanceOfCreation / 2)) {
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id +
                ' : *BANG* *BANG* Shut up and give us all your food now!'));
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id +
                ' : Here take it all but don\'t kill us. -(' +
                this.ingredients + ')'));
              this.ingredients = [0, 0, 0];
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id + ' : Alright let\'s get out of here boys!'));
              this.isOpen = false;
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id + ' : 911 How can I help you?! We\'ve just been ' +
                'robbed, they took all our food...'));
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id + ' is closed for the day.' + '(' +
                this.ingredients + ')'));
            } else {
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id +
                ' : *BANG* *BANG* Shut up and give us your points!'));
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id +
                ' : Here take all our points but don\'t kill us. -(' +
                this.dayPoints + ')'));
              this.dayPoints = 0;
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id +
                ' : Alright let\'s get out of here boys!'));
              console.log(chalk.red(this.localTime() + ' Restaurant ' +
                this.id +
                ' : 911 How can I help you?! We\'ve just been ' +
                'robbed, they took all our points...'));
            }
          }
        }
      }
    });
  }
  // Function to get clock time
  localTime() {
    if (mainClock.mainClock.minute < 10) {
      return mainClock.mainClock.hour + ':0' + mainClock.mainClock.minute;
    } else if (mainClock.mainClock.minute > 9) {
      return mainClock.mainClock.hour + ':' + mainClock.mainClock.minute;
    }
  }
  // Function to check if certain recipe can be cooked
  canRecipeBeCooked(recipeNumber) {
    var count = 0;
    for (var x = 0; x < this.ingredients.length; x++) {
      if (this.ingredients[x] >= this.recipes[recipeNumber][x]) {
        count++;
      }
    }
    if (count == this.ingredients.length) {
      return true;
    }
  }
  // Function to enable restaurant to go to market to get ingredients
  goToMarket(restaurantNumber) {
    if (this.id == restaurantNumber && this.isOpen) {
      // Market refueling waiting time : from 15 to 75 minutes
      var marketWaitingTime = Math.floor((61 * Math.random()) + 15);
      if (Market.market.isOpen) {
        setTimeout(() => {
          for (var x = 0; x < this.ingredients.length; x++) {
            this.ingredients[x] = marketRefuelValue;
          }
          console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
          this.id + ' went to the market' + '(' + marketWaitingTime + ').' +
        '(' + this.ingredients + ')'));}, marketWaitingTime * msForMinute);
      } else {
        console.log(chalk.yellow(this.localTime() + ' Restaurant ' +
          this.id + ' went to the market, but it was closed.'));
      }
    }
  }
}

// Client class
class client{
  /**
   * Construct a Client
   * @param {int} id - Specific an unique ID for the client
     */
  constructor(id) {
    this.id = id; // Identification number of client
    this.patience = Math.floor((31 * Math.random()) + 10); // Patience 10-40min
    this.retry = 0; // Number of tries to enter restaurants of client
    this.hungry = true;
    // Launching restaurant search for client immediately after creation
    setTimeout(() => {this.lookForRestaurant(this.id);}, 1);

    // Event to enable client to retry a restaurant
    ev.on('retryRestaurant', (idClient) => {
      if (this.id == idClient) {
        this.retry += 1;
        // If client has'nt already retried 3 times
        if (this.retry < 4) {
          console.log(this.currentTime() + ' Client ' + this.id +
            ' : I\'ll try a restaurant in ' + tryAnother + ' minutes...');
          // Enable client to retry new restaurant after certain waiting time
          setTimeout(() => {this.lookForRestaurant(this.id);},
            tryAnother * msForMinute);
        // If client has retried 3 times -> client leaves
        } else {
          console.log(this.currentTime() + ' Client ' + this.id +
            ' : I have no more time, I will get food somewhere else.');
          this.hungry = false;
        }
      }
    });
    // Event to make client wait for his food
    ev.on('waitForCooking', (idClient, restaurantNumber, stock) => {
      if (this.id == idClient) {
        var cookingTime = Math.floor(46 * Math.random() + 5); //CookingTime 5-50
        console.log(chalk.yellow(this.currentTime() + ' Restaurant ' +
          restaurantNumber + ' : We are cooking your meal.' +
          '(' + cookingTime + ')'));
        console.log(this.currentTime() + ' Client ' + this.id +
          ' : I will wait.' + '(' + this.patience + ')');
        // Serve client after cooking time is over
        setTimeout(()=> {
          ev.emit('clientIsServed', idClient, restaurantNumber, stock,
            cookingTime, this.patience);
        }, cookingTime * msForMinute);
      }
    });
    // Event that tells client his food is ready
    ev.on('clientIsServed', (idClient, rN, stock, cookingTime, patience) => {
      // For specific client set the appropriate point number according
      // to patience and waiting time.
      if (this.id == idClient) {
        this.hungry = false;
        var points = 0;
        console.log(chalk.yellow(this.currentTime() + ' Restaurant ' +
          rN + ' : We finished cooking!' + '(' + stock + ')'));
        if (patience - cookingTime >= 10) {
          points = 2;
          console.log(this.currentTime() + ' Client ' + idClient + ' : ' +
            'That was quick!' + '(+' + points + ')');
        } else if (patience - cookingTime <= 10) {
          if (patience - cookingTime <= -5) {
            points = 0;
            console.log(this.currentTime() + ' Client ' + idClient + ' : ' +
              'That took a while!' + '(+' + points + ')');
          } else {
            points = 1;
            console.log(this.currentTime() + ' Client ' + idClient + ' : ' +
              'Thank you!' + '(+' + points + ')');
          }
        }
        ev.emit('clientIsLeaving', rN, points);
        /*DELETE DELETE DELETE DELETE DELETE*/
      }
    });
  }
  // Function to get clock time
  currentTime() {
      if (mainClock.mainClock.minute < 10) {
        return mainClock.mainClock.hour + ':0' + mainClock.mainClock.minute;
      } else if (mainClock.mainClock.minute > 9) {
        return mainClock.mainClock.hour + ':' + mainClock.mainClock.minute;
      }
    }
  // Function to look for a restaurant for a specific client
  lookForRestaurant(id) {
      if (this.id == id) {
        console.log(this.currentTime() + ' Client ' + this.id +
          ' : I am hungry.');
        // Choose random restaurant
        var chooseRestaurant = Math.floor((listOfRestaurants.length) *
          Math.random());
        // Choose random recipe
        var chooseRecipe = Math.floor(numberOfRecipes * Math.random());
        console.log(this.currentTime() + ' Client ' + this.id +
          ' : Can I come in restaurant ' + chooseRestaurant + '?');
        // Check if restaurant is opened or not
        ev.emit('isRestaurantOpened', this.id, chooseRestaurant, chooseRecipe);
      }
    }
}


//CreateClient outside of client class because cannot
//call event of object class if object hasn't been created.
var Client = require('./crc.js');
var creationId = -1;
// Event to create clients
// Creating client table of 20 clients and reusing them to prevent
// Warning : Event Emitter memory leak
ev.on('createClients', () => {
  creationId++;
  if (creationId < 20) {
    var newClient = new Client.client(creationId);
    listOfClients.push(newClient);
    console.log(chalk.black(mainClock.mainClock.hour + ':' +
      mainClock.mainClock.minute +
      ' *** Client n°' + newClient.id + ' ***'));
  } else {
    for (var y = 0; y < 20; y++) {
      if (!listOfClients[y].hungry) {
        listOfClients[y].hunger = true;
        listOfClients[y].retry = 0;
        listOfClients[y].id = creationId;
        console.log(chalk.black(mainClock.mainClock.hour + ':' +
          mainClock.mainClock.minute +
          ' *** Client n°' + listOfClients[y].id + ' ***'));
        listOfClients[y].lookForRestaurant(listOfClients[y].id);
        break;
      }
    }
  }
});


module.exports.clock = Clock;
module.exports.restaurant = restaurant;
module.exports.client = client;

module.exports.listOfRestaurants = listOfRestaurants;
module.exports.numberOfRestaurants = numberOfRestaurants;
module.exports.numberOfRecipes = numberOfRecipes;
module.exports.ingredientsNumber = ingredientsNumber;
module.exports.daysOfSimulation = daysOfSimulation;
