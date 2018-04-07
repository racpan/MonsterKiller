var Monster = require('./monster');
var armorTypes = require('../armor-types');
var damageTypes = require('../damage-types');

class Ground extends Monster {
    constructor(level){
        super(level);
        this.armorType = armorTypes.groundMonsterHide();
        this.damageType = damageTypes.MELEE_DAMAGE;
    }
}

module.exports = Ground;