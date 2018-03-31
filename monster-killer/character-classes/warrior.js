var Character = require('./character');
var armorTypes = require('../armor-types');

class Warrior extends Character {
    constructor(name){
        super(name);
        this.str = 30;
        this.mgk = 20;
        this.acc = 10;
        this.armor = armorTypes.heavyArmor();
    }
}

module.exports = Warrior;