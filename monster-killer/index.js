var utils = require('./utils');
var newCharacter = require('./new-character');
var Monster = require('./monster-classes/monster')

var character = newCharacter("bigbitch", "archer");
var newMonster = new Monster(1);
newMonster.attack(character);
console.log('CHANGE');
