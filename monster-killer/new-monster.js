var utils = require('./utils');
var MonsterConstructor;

function monsterType() {
    var rand = utils.getRandom(0,3)
    if (rand < 1) {
        return 'flying';
    } else if (rand < 2) {
        return 'ground';
    } else {
        return 'spectral';
    }
}

function newMonster(level) {
    switch(monsterType()) {
        case 'flying':
            MonsterConstructor = require('./monster-classes/flying');
        break;
        case 'ground':
            MonsterConstructor = require('./monster-classes/ground');
        break;
        case 'spectral':
            MonsterConstructor = require('./monster-classes/spectral');
        break;
    }
    
    var monster = new MonsterConstructor(level);
    monster.monsterName;

    monster.on('damageMonster', function(character, characterDamage) {
        var appliedDamage = 0;
        switch(monster.armorType.type) {
            case 'Flying':
                appliedDamage = characterDamage.accuracy;
            break;
            case 'Ground':
                appliedDamage = characterDamage.strength;
            break;
            case 'Spectral':
                appliedDamage = characterDamage.magic;
            break;
        }
        monster.accumulatedDamage = monster.accumulatedDamage + appliedDamage;
        console.log(`${character.name} attacks ${monster.name} for ${appliedDamage}`);
        if (monster.health <= 0) {
            monster.emit('monsterDies', character);
        }
        
        /*
        x
        if monsterHide is flying --> use characterDamage.accuracy 
        if monsterHide is ground --> use characterDamage.strength 
        if monsterHide is spectral --> use characterDamage.magic
        use the value to add to the accumulated damage  
        */
        //what happens when a monster dies
    });

    monster.on('monsterDies', function(character) {
        if (character.expToNext <= monster.experienceGranted) {
            character.emit('levelUp');
        } else {
            character.accumulatedExp = character.accumulatedExp + monster.experienceGranted;
        }
        if (monster.hasPotion) {
            console.log(`You got a level ${monster.level} potion`);
            //add potion to inventory same level as monster
        }
    });
    return monster;
}

module.exports = newMonster;


/*
create monster constructor use switch to assign constructor function to it
create main event listeners on monster instance
determine which constructor to use
New class that extends Monster base class 
set varying properties:
    projectile damage
    flying monster hide


EVENTS - Set up event listeners in new-monster.js
*** emitters can only respond to events with listeners in the same object
    - Emit these events via methods performed by character or monster. 
    Examples: 
        - character.attack(monster) --> emit damageMonster --> emit monsterDies 
        - monster.die(character) --> emit gainExperience
        - monster.attack(character) --> emit damageCharacter 

*/