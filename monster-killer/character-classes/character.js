var EventEmitter = require('events');
var utils = require('../utils');
var mathjs = require('mathjs');

class Character extends EventEmitter {
    constructor(name){
        super();
        this.name = name;
        this.level = 1;
        this.critChance = utils.getRandom(.1,.2);
        this.critMult = utils.getRandom(2,4);
        this.toughness = utils.getRandom(1.25,1.5);
        this.atkPower = utils.getRandom(1,1.37);
        this.accumulatedDamage = 0;
        this.accumulatedExp = 0; 
        this.str = 1;
        this.mgk = 1;
        this.acc = 1;
        this.armorType;
        this.maxHealth = ((this.level^2.2) + 10);;
        this.totalExpToNext; 
        this.message;
    }

    get powerScale() {
        if (this.level == 1) {
            return 0.1;
        } else {
            return 3.5;
        }
    }
    get health() {
        //maxHealth - damageAccumulated
        return this.maxHealth - this.accumulatedDamage;
       
    }
    get expToNext() {
        this.totalExpToNext = this.level ^ 3;
        return this.totalExpToNext - this.accumulatedExp; 
    }
    get dps() {
        return mathjs.log(mathjs.pow(this.level,1.37),1.2)+3;

    }

    
    attack(monster) {
        var characterDamage = {};
        var baseAccuracy = (this.acc - utils.getRandom(0,5)) * (this.dps - this.powerScale);
        var baseStrength = (this.str - utils.getRandom(0,5)) * (this.dps - this.powerScale);
        var baseMagic = (this.mgk - utils.getRandom(0,5)) * (this.dps - this.powerScale);
        var critRoll = Math.random();
        if (critRoll < this.critChance) {
            characterDamage.accuracy = baseAccuracy * this.critMult;
            characterDamage.strength = baseStrength * this.critMult;
            characterDamage.magic = baseMagic * this.critMult;
            console.log('crit');
        } else {
            characterDamage.accuracy = baseAccuracy;
            characterDamage.strength = baseStrength;
            characterDamage.magic = baseMagic;
        }
        return monster.emit('damageMonster', this, characterDamage);
    }
    run() {

    }
}
module.exports = Character;
/*
Determine if critical attack 
roll within Crit % chance of character 
Calculates RNG Damage Value 

For each damage type: 
damageType = damageType - range(0, 5)
baseDmg = damageType * DPS
if (crit) --> totalDmg = baseDmg * critMultiplier

Builds a Damage object
For each damage type assign a totalDmg Value to this object
{strength: totalDmg, magic: totalDmg, accuracy: totalDmg}


Emits "DamageMonster" event passing the Damage object
Monster responds to this event via listener
Listener determines damage value using Damage object properties.

EVENTS - Set up event listeners in new-monster.js
*** emitters can only respond to events with listeners in the same object
    - Emit these events via methods performed by character or monster. 
    Examples: 
        - character.attack(monster) --> emit damageMonster --> emit monsterDies 
        - monster.die(character) --> emit gainExperience
        - monster.attack(character) --> emit damageCharacter 
        */