var Monster = require('./monster');
var armorTypes = require('../armor-types');
var damageTypes = require('../damage-types');

class Flying extends Monster {
    constructor(level){
        super(level);
        this.armorType = armorTypes.flyingMonsterHide();
        this.damageType = damageTypes.PROJECTILE_DAMAGE;
    }
}
module.exports = Flying;