var Character = require('./character');
var armorTypes = require('../armor-types');

class Mage extends Character {
    constructor(name){
        super(name);
        this.str = 10;
        this.mgk = 30;
        this.acc = 20;
        this.armor = armorTypes.lightArmor();
        this.class = "Mage";
    }
}

module.exports = Mage;