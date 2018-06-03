var fs = require('fs');
var path = require('path');

var fetchCharacter = (filename) => {
    // Load existing Components from pe-components file 
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, filename + ".json")));
    } catch (error) {        
        // This writes the givin text to the file specified.
        try {
            fs.appendFileSync(`${__dirname}/${filename}.json`, '[]', 'utf8');
            return JSON.parse(fs.readFileSync(path.join(__dirname, filename + ".json")));
        } catch (error) {
            return undefined;
        }        
    }    
};

var saveCharacter = (character, filename) => {
    // Rewrite the components file 
    fs.writeFileSync(path.join(__dirname, `${filename}.json`), JSON.stringify(character));
};

module.exports = {
    fetchCharacter,
    saveCharacter
}
//save character info
//player chooses which character to continue in the beginning
//save per level up
//load start of game
/*
say throughout the app we'll be passing around a character object and a filename

*/