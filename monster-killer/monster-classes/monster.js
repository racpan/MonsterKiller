var EventEmitter = require('events');
var utils = require('../utils');
var armorTypes = require('../armor-types');

var nameLists = [
    armorTypes.FLYING_NAMES, 
    armorTypes.SPECTRAL_NAMES, 
    armorTypes.GROUND_NAMES
];

var armorTypeList = [
    armorTypes.flyingMonsterHide, 
    armorTypes.spectralMonsterHide, 
    armorTypes.groundMonsterHide
];

class Monster extends EventEmitter {
    constructor(level) {
        super();
        var index = Math.floor(utils.getRandom(0, 3));
        this.armorType = armorTypeList[index]();
        var nameList = nameLists[index];
        this.name = utils.nameGenerator(this.armorType.armorIndex, nameList)
        this.level = level;
    }
    attack(character) {
        //emit damageCharacter event
        character.emit('damageCharacter', this.monsterDamage);
    }
    get monsterDamage() {
        return ((this.level * 40) / 1.4);
    }
}
module.exports = Monster;