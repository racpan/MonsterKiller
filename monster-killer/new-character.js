var damageTypes = require('./damage-types');
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
        console.log('monster attacked for ' + monsterDamage.amount);
        if (player1.health <= 0) {
            player1.emit('characterDies');
        }
        
    });
    player1.on('levelUp', function() {
        player1.level++;
        player1.accumulatedExp = 0;
        console.log("You leveled up?");
    });
    player1.on('characterDies', function() {
        console.log('You dead');
        player1.accumulatedExp = 0;
    });

    return player1;
}

module.exports = newCharacter;

// Character takes Damage via "DamageCharacter" event
// Damage Taken = (MonsterDmg * armorMultiplier)/toughness
// Character Dies - Progress to next level resets 