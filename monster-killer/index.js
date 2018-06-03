var utils = require('./utils');
var newCharacter = require('./new-character');
var newMonster = require('./new-monster')
var vorpal = require('vorpal')();
var store = require('./files/utils');
var loadCharacter = require('./load-character');
var asDefault = require('vorpal-as-default');


let character;
let monster;

function chooseName (self, callback, option) {
    self.prompt({
        type: 'input',
        name: 'nameOfCharacter',
        message: "Enter the name of the Character!",
        validate: function (answer) {
            if (!answer) {
                return ('You must enter a name');
            } else {
                return true;
            }
        }
    }, (answer) => {            
        if (option == "New Character") {
            // this.log("Your class", answers);
            vorpal.exec(`new ${answer}`);
            callback();
            // self.log(answers.propertyChooser);                                
        } else {
            vorpal.exec(`continue ${answer}`);
            callback();
        }    
    });
}

vorpal
    .command("default", "Starts Game")
    .action(function (args, callback){
        var startChoices = ["New Character", "Continue Character"];
        this.prompt({
            type: 'list',
            name: 'startGameChoice',
            choices: startChoices,
            message: "Welcome to Monster Killer. What you wanna do?",
            validate: function (answer) {
                if (answer.length < 1) {
                    return ('You must choose a option');
                } else {
                    return true;
                }
            }
        }, (answers) => {            
            chooseName(this, callback, answers);     
        });
    });

vorpal
    .command('new <name>', "Create new character")
    .action(function(args, callback) {
        var classChoices = ["Mage", "Warrior", "Archer"];
        var name = args.name;
        var message = "Please choose a class for your character!";
        this.prompt({
            type: 'list',
            name: 'classChooser',
            choices: classChoices,
            message: message,
            validate: function (answer) {
                if (answer.length < 1) {
                    return ('You must choose a class');
                } else {
                    return true;
                }
            }
        }, (answers) => {            
            if (answers) {
                // this.log("Your class", answers);
                character = newCharacter(args.name, answers.classChooser);
                callback();
                // self.log(answers.propertyChooser);                                
            } else {
                this.log("Something went wrong..");
                callback();
            }                            
        });
    });
vorpal
    .command('fight', "Create monster")
    .action(function(args, callback) {
        this.prompt({
            type: 'input',
            name: 'levelChosen',
            message: "Please Enter the Level of Monster you wish to fight! ",
            validate: function (answer) {
                if (answer == NaN || answer < 1 || answer > 100) {
                    return ('You enter a number between 1 and 100');
                } else {
                    return true;
                }
            }
        }, (answer) => {            
            if (answer) {
                // this.log("Your class", answers);
                monster = newMonster(answer);
                this.log(`Your fight with level ${monster.level} ${monster.name} has begun!`);
                callback();
                // self.log(answers.propertyChooser);                                
            } else {
                this.log("Something went wrong..");
                callback();
            }                            
        });
        callback();
    });
vorpal
    .command('continue <character>', "Load Character")
    .action(function(args, callback) {
        character = store.fetchCharacter(args.character);
        character = loadCharacter(character);
        vorpal.exec('fight');
        callback();
    });
vorpal
    .command('attack', "Attack Monster")
    .action(function(args,callback) {
        if (monster && character) {
            monster.attack(character);
            character.attack(monster);
            this.log(`${monster.message} \n ${character.message}`);
        }
        if(monster == null) {
            store.saveCharacter(character, character.name);
            this.log(`Game saved`);
            vorpal.exec('fight');
        } 
        if (character == null) {
            monster = null;
            var choices = ['Yes', 'No'];
            var message = 'Yall dead. Continue? Restart level? Watchu want.'
            this.prompt({
                type: 'list',
                name: 'continueGame',
                choices: choices,
                message: message,
                validate: function (answer) {
                    if (answer.length < 1) {
                        return ('You must choose an option');
                    } else {
                        return true;
                    }
                }
            }, (answers) => {            
                if (answers) {
                    // this.log("Your class", answers);
                    if (answers.continueGame == "Yes") {
                        store.fetchCharacter(character.name);
                        vorpal.exec('fight');
                    } else {
                        vorpal.exec("exit");
                    };
                    // self.log(answers.propertyChooser);                                
                } else {
                    this.log("Something went wrong..");
                    callback();
                }                            
            });
        }
        callback();
    });
vorpal
    .delimiter('Monster Killer$')
    .show();

    // var character = newCharacter("bigbitch", "archer");
// var monster = newMonster(character.level);
// monster.attack(character);
// character.attack(monster);
/*
git add -A
git commit
git push origin master
*/