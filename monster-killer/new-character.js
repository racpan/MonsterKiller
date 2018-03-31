var CharConstructor;
/*
player creates character and inputs name and class
add listeners to the character
select class based on player input
export the whole function
*/
function newCharacter(name, characterClass) {
    switch(characterClass) {
        case "mage":
            CharConstructor = require("./character-classes/mage");
        break;
        case "archer":
            CharConstructor = require("./character-classes/archer");
        break;
        case "warrior":
            CharConstructor = require("./character-classes/warrior");
        break;
    }
    
    var player1 = new CharConstructor(name);
    
    player1.on('damageCharacter', function(monsterDamage) {
        console.log('monster attacked for ' + monsterDamage);
    });
    player1.on('gainExperience', function() {
        // gain exp
    });
    player1.on('levelUp', function() {

    });
    player1.on('charDies', function() {

    });

    return player1;
}

module.exports = newCharacter; 