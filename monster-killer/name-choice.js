var utils = require('./utils');
var armorTypes = require('./armor-types');

function nameChoice(monster) {
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
    
    var nameList;
    switch(monster.armorType.type) {
        case("Flying"):
            nameList = nameLists[0];
        break
        case("Spectral"):
            nameList = nameLists[1];
        break 
        case("Ground"):
            nameList = nameLists[2];
        break
    }
    return utils.nameGenerator(monster.armorType.armorIndex, nameList);
}

module.exports = {
    nameChoice
};