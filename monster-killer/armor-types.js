var utils = require('./utils');

function lightArmor() {
    return {
        name: "Light Armor",
        projectileMult: .15, 
        meleeMult: .2,
        magicMult: .1
    }
}
function mediumArmor() {
    return {
        name: "Medium Armor",
        projectileMult: .1, 
        meleeMult: .15,
        magicMult: .2
    }
}
function heavyArmor() {
    return {
        name: "Heavy Armor",
        projectileMult: .20, 
        meleeMult: .1,
        magicMult: .15
    }
}

const FLYING_NAMES = ["Quill", "Furry", "Leathery", "Feathery"];
const SPECTRAL_NAMES = ["Spirit", "Gaseous", "Ectoplasmic", "Energy"];
const GROUND_NAMES = ["Scaly", "Rocky", "Wooden", "Iron"]; 

function flyingMonsterHide() {
    var names = ["Quills", "Fur", "Leather", "Feathers"];
    var name = utils.chooseItemFromArray(names);
    return {
        name: utils.chooseItemFromArray(names),
        armorIndex: names.indexOf(name),
        type: "Flying"
    }
}
function spectralMonsterHide() {
    names = ["Spirit", "Gas", "Ectoplasm", "Energy"];
    var name = utils.chooseItemFromArray(names);
    return {
        name: utils.chooseItemFromArray(names),
        armorIndex: names.indexOf(name),
        type: "Spectral"
    }
}
function groundMonsterHide() {
    names = ["Scales", "Rock", "Wood", "Iron"]; 
    var name = utils.chooseItemFromArray(names);
    return {
        name,
        armorIndex: names.indexOf(name),
        type: "Ground"
    }
}
module.exports = {
    lightArmor,
    mediumArmor,
    heavyArmor,
    flyingMonsterHide,
    spectralMonsterHide,
    groundMonsterHide,
    FLYING_NAMES,
    SPECTRAL_NAMES,
    GROUND_NAMES
}