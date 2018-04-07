var Monster = require('./monster');
var armorTypes = require('../armor-types');
var damageTypes = require('../damage-types');

class Spectral extends Monster {
    constructor(level){
        super(level);
        this.armorType = armorTypes.spectralMonsterHide();
        this.damageType = damageTypes.MAGIC_DAMAGE;
    }
}

module.exports = Spectral;