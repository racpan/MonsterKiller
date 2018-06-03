var damageTypes = require('./damage-types');
var CharConstructor = require('./character-classes/character');
var store = require('./files/utils');
var lodash = require('lodash');
/*
player creates character and inputs name and class
add listeners to the character
select class based on player input
export the whole function
*/
function loadCharacter(character) {
    
    var player1 = new CharConstructor(character.name);
    // console.log(player1);
    // console.log(character);
    lodash.assignIn(player1, character);
    
    player1.on('damageCharacter', function(monsterDamage) {
        // character armor type 
        // monster damage type 
        // if ... then ... 
        // calculate damage taken by character 
        var totalDamage = 0;
        switch (monsterDamage.type) {
            case (damageTypes.MAGIC_DAMAGE):
                totalDamage = (monsterDamage.amount * player1.armor.magicMult) / player1.toughness;
            break;
            case (damageTypes.MELEE_DAMAGE):
                totalDamage = (monsterDamage.amount * player1.armor.meleeMult) / player1.toughness;
            break;
            case (damageTypes.PROJECTILE_DAMAGE):
                totalDamage = (monsterDamage.amount * player1.armor.projectileMult) / player1.toughness;
            break;
        }
        player1.accumulatedDamage = player1.accumulatedDamage + totalDamage;
        var message = ('monster attacked for ' + monsterDamage.amount);
        if (player1.health <= 0) {
            player1.emit('characterDies', message);
        } else {
            player1.message = message;
        }
    });
    player1.on('levelUp', function() {
        player1.level++;
        player1.accumulatedExp = 0;
        var message = "You leveled up?";
        player1.message =  message;
    });
    player1.on('characterDies', function(damageAmount) {
        var message = "You dead!";
        player1.accumulatedExp = 0;
        player1.message = `${damageAmount} \n ${message}`;
    });
    store.saveCharacter(player1, player1.name);
    return player1;
}

module.exports = loadCharacter;

// Character takes Damage via "DamageCharacter" event
// Damage Taken = (MonsterDmg * armorMultiplier)/toughness
// Character Dies - Progress to next level resets 