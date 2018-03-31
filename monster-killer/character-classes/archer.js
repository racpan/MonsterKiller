var Character = require('./character');
var armorTypes = require('../armor-types');

class Archer extends Character {
    constructor(name){
        super(name);
        this.str = 20;
        this.mgk = 10;
        this.acc = 30;
        this.armor = armorTypes.mediumArmor();
    }
}

module.exports = Archer;