var utils = require('./utils');
var newCharacter = require('./new-character');
var newMonster = require('./new-monster')

var character = newCharacter("bigbitch", "archer");
var monster = newMonster(character.level);
monster.attack(character);
character.attack(monster);
/*
git add -A
git commit
git push origin master
*/