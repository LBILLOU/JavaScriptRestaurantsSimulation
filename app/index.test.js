var expect = require('chai').expect;
var describe = require('describe');
var it = require('it');
var Crc = require('./crc.js');

Crc.restaurant.testRestaurant = new Crc.restaurant(0, [6, 22], 5);
Crc.client.testClient = new Crc.client(0);

describe('Unit Tests', function() {
  'use strict';
  it('Positive number of days of simulation.', function() {
    expect(Crc.daysOfSimulation).to.be.greaterThan(0);
  });
  it('Positive number of restaurants.', function() {
    expect(Crc.numberOfRestaurants).to.be.greaterThan(0);
  });
  describe('Restaurant', function() {
    it('No points of the day for retaurant when created.', function() {
      expect(Crc.restaurant.testRestaurant.dayPoints).to.equal(0);
    });
    it('No clients in restaurant when created.', function() {
      expect(Crc.restaurant.testRestaurant.clients).to.equal(0);
    });
    it('Number of recipes declared equals number in constructor.', function() {
      var x = Crc.numberOfRecipes;
      expect(Crc.restaurant.testRestaurant.recipes.length).to.equal(x);
    });
    it('Number of ingredients declared equals number in constructor ' +
      '(stocks and recipe definition).', function() {
      var x = Crc.ingredientsNumber;
      expect(Crc.restaurant.testRestaurant.ingredients.length).to.equal(x);
      for (var y = 0; y < Crc.restaurant.testRestaurant.recipes.length; y++) {
        expect(Crc.restaurant.testRestaurant.recipes[y].length).to.equal(x);
      }
    });
  });
  describe('Client', function() {
    it('Hunger must be true when created.', function() {
      expect(Crc.client.testClient.hungry).to.equal(true);
    });

  });
});
