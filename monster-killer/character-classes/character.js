var EventEmitter = require('events');
var utils = require('../utils');

class Character extends EventEmitter {
    constructor(name){
        super();
        this.name = name;
        this.accumulatedExp = 0; 
        this.level = 1;
        this.critChance = utils.getRandom(.1,.2);
        this.critMult = utils.getRandom(2,4);
        this.toughness = utils.getRandom(1.25,1.5);
        this.atkPower = utils.getRandom(1,1.37);
        this.accumulatedDamage = 0;
        this.str;
        this.mgk;
        this.acc;
        this.armorType;
        this.maxHealth;
        this.totalExpToNext; 
    }

    get health() {
        //maxHealth - damageAccumulated
        this.maxHealth = ((this.level^2.2) + 10);
        return this.maxHealth - this.accumulatedDamage;
       
    }
    get expToNext() {
        this.totalExpToNext = this.level ^ 3;
        return this.totalExpToNext - this.accumulatedExp; 
    }
}
module.exports = Character;