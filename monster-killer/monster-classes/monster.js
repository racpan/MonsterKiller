var EventEmitter = require('events');
var utils = require('../utils');
var armorTypes = require('../armor-types');
var damageTypes = require('../damage-types');
var nameChoice = require("../name-choice");

class Monster extends EventEmitter {
    constructor(level) {
        super();
        this.armorType = armorTypes.flyingMonsterHide();
        this.damageType = damageTypes.PROJECTILE_DAMAGE;
        this.level = level;
        this.name = '';
        this.hasPotion = this.getPotion();
        this.maxHealth = ((level ^ 2) * 8) + 230;
        this.accumulatedDamage = 0;
    }
    attack(character) {
        //emit damageCharacter event
        character.emit('damageCharacter', this.monsterDamage);
    }
    get monsterName() {
        this.name = nameChoice.nameChoice(this);
    }
    get monsterDamage() {
        return {
            amount: ((this.level * 40) / 1.4),
            type: this.damageType 
        };
    }
    get experienceGranted() {
        return (this.level ^ 2);
    }
    get health() {
        return this.maxHealth - this.accumulatedDamage;
    }
    getPotion() {
        if (utils.getRandom(0,2) < 1) {
            return true;
        } else {
            return false;
        }
    }
}
module.exports = Monster;