const fs = require("fs");
const path = require('path');
const _ = require("lodash");
const utils = require('./utils');


// ------------------------------------------------------------
// ADD, REMOVE, AND UPDATE COMPONENTS  
// ------------------------------------------------------------
// THESE SHOULD RETURN THE COMPONENT OBJECT OR EXCEPTION 
// This way pretty print can respond if there is an exception passed to it.
var addComponent = (name, type) => {
    
    var components = fetchComponents();

    // Throw exception if no .json data file is read.  
    if (!components) {
        throw new utils.RandomException(`No component data. Make sure there is a components.json file next to the component-manager.js script.`);
    }

    // Check for duplicates 
    var duplicateComponents = components.filter((component) => {
        return (component.name === name);
    });

    // If duplicates throw exception  
    if (duplicateComponents.length !== 0) {
        throw new utils.BadInputException(`There is already a component with name: "${name}".`);
    } else {
        // Create new component
        var component; 
        if (type === 'atom' || type === 'molecule') {
            component = utils.createAtomOrMolecule(name, type);
        } else if (type === 'organism') {
            component = utils.createOrganism(name, type);
        } else if (type === 'template') {
            component = utils.createTemplate(name, type);
        }               

        // Push new note onto file object 
        components.push(component);
        saveComponents(components);
        return component;
    }    
};
 
var removeComponent = (name) => {    
    var components = fetchComponents();

    // Remove with filter --> more efficient based on specification algorithm 
    var filteredComponents = components.filter((component) => {
        return component.name !== name;
    });

    try{
        saveComponents(filteredComponents);                          
    } catch(error) {
        throw new utils.RandomException(`There was an error removing the component: ${name}`);
    }
    // If length the same nothing was removed AKA false;
    if (components.length === filteredComponents.length) {
        throw new utils.BadInputException(`Did not find component: ${name}! Nothing Removed.`)
    } else {
        // Return updated/filtered component list for pretty printing.        
        return filteredComponents;
    }    
}; 

var updateComponent = (componentName, key, newValue) => {
    
    var components = fetchComponents();

    // Throw exception if no .json data file is read.  
    if (!components) {
        throw new utils.RandomException(`No component data. Make sure there is a components.json file next to the component-manager.js script.`);
    } 

    var component = _.find(components, (component) => {return component.name === componentName});
    if (!component) {
        throw new utils.BadInputException(`Did not find component: ${componentName}! Nothing updated.`);
    } else {
        var path = utils.createPathToProperty(component, key, "");
        if (newValue === "true" || newValue === "false") {
            newValue = (newValue == 'true');
        }
        var updatedComponent = _.set(component, path[0], newValue);
        saveComponents(components);
        return updatedComponent;
    }        
};    


// ------------------------------------------------------------
// ADD & REMOVE BASE FUNCTIONS    
// ------------------------------------------------------------
var adder = (componentName, typeToAddID, type) => {
    var typeIDKey, componentTypeArray, uniqueID, creator;
    if (type === 'variation') {
        typeIDKey = 'variationName';
        componentTypeArray = 'variations';
        uniqueID = "name";
        creator = utils.createVariation;
    } else if (type === 'modifier') {
        typeIDKey = 'modifierName';
        componentTypeArray = 'modifiers';
        uniqueID = "name";
        creator = utils.createModifier;
    } else if (type === 'breakpoint') {
        typeIDKey = 'breakpointSize';
        componentTypeArray = 'breakpoints';
        uniqueID = "size";
        creator = utils.createBreakpoint;
    } else {
        typeIDKey = 'stateName';
        componentTypeArray = 'states';
        uniqueID = "name";
        creator = utils.createState;
    }
    // get all components
    var components = fetchComponents();
    
    // get component in question 
    var component = _.find(components, (component) => {return component.name === componentName});
    
    // check for duplicates if component has variations property  
    if (_.has(component, componentTypeArray)) {
        var duplicates = component[componentTypeArray].filter((type) => {
            return (type[typeIDKey] === typeToAddID);
        });
    } else {
        throw new utils.BadInputException(`Component of type, "${component.type}", does not have "${componentTypeArray}" property!`);
    }   

    // If duplicates log error 
    if (duplicates.length !== 0) {
        throw new utils.BadInputException(`There is already a ${type} with ${uniqueID}: "${typeToAddID}".`);
    } else {
        // Create new object         
        var newObject = creator(typeToAddID);
        // push object onto component's corresponding type array
        // save and return the component.
        component[componentTypeArray].push(newObject);            
        saveComponents(components);
        return component; 
    }

};

var remover = (componentName, typeToRemoveID, type) => {
    var typeIDKey, componentTypeArray, uniqueID, typeUpper;
    if (type === 'variation') {
        typeIDKey = 'variationName';
        componentTypeArray = 'variations';
        uniqueID = "name";
        typeUpper = "Variation";
    } else if (type === 'modifier') {
        typeIDKey = 'modifierName';
        componentTypeArray = 'modifiers';
        uniqueID = "name";
        typeUpper = "Modifier";
    } else if (type === 'breakpoint') {
        typeIDKey = 'breakpointSize';
        componentTypeArray = 'breakpoints';
        uniqueID = "size";
        typeUpper = "Breakpoint";
    } else {
        typeIDKey = 'stateName';
        componentTypeArray = 'states';
        uniqueID = "name";
        typeUpper = "State";
    }
    // get all components
    var components = fetchComponents();
    
    // get component in question 
    var component = _.find(components, (component) => {return component.name === componentName});
    
    // check for duplicates if component has variations property  
    if (_.has(component, componentTypeArray)) {
        var removed = _.remove(component[componentTypeArray], (type) => {
            return type[typeIDKey] === typeToRemoveID;
        });
    } else {
        throw new utils.BadInputException(`Component of type, "${component.type}", does not have "${componentTypeArray}" property!`);
    }
    
    // If nothing removed throw exception 
    if (removed.length === 0) {
        throw new utils.BadInputException(`${typeUpper} with ${uniqueID}, "${typeToRemoveID}", not found!`);
    } else {
        // save and return the component.                    
        saveComponents(components);
        return component; 
    }
};

var updater = (componentName, typeToUpdateID, key, newValue, type) => {
    var typeIDKey, componentTypeArray, uniqueID, typeUpper;
    if (type === 'variation') {
        typeIDKey = 'variationName';
        componentTypeArray = 'variations';
        uniqueID = "name";
        typeUpper = 'Variation';
    } else if (type === 'modifier') {
        typeIDKey = 'modifierName';
        componentTypeArray = 'modifiers';
        uniqueID = "name";
        typeUpper = 'Modifier';
    } else if (type === 'breakpoint') {
        typeIDKey = 'breakpointSize';
        componentTypeArray = 'breakpoints';
        uniqueID = "size";
        typeUpper = 'Breakpoint';
    } else {
        typeIDKey = 'stateName';
        componentTypeArray = 'states';
        uniqueID = "name";
        typeUpper = 'State';
    }
    // get all components
    var components = fetchComponents();
    
    // get component in question 
    var component = _.find(components, (component) => {return component.name === componentName});
    
    // if component has typeArray property find the type    
    if (_.has(component, componentTypeArray)) {
        var updateObject = _.find(component[componentTypeArray], (type) => {return type[typeIDKey] === typeToUpdateID});
    } else {
        throw new utils.BadInputException(`Component of type, "${component.type}", does not have "${componentTypeArray}" property!`);
    }

    // Check if object was found 
    if (updateObject) {
        var oldValue = updateObject[key]; 
    } else {
        throw new utils.BadInputException(`${typeUpper} ${uniqueID}d: "${typeToUpdateID}" not found!`);
    }
    
    // Update object's property
    if (oldValue === newValue) {
        throw new utils.BadInputException(`${typeUpper} not updated - ${key} is already set to "${newValue}"`);
    } else {
        if (newValue === "true" || newValue === "false") {
            newValue = (newValue == 'true');
        }
        _.set(updateObject, key, newValue);
    }    

    if (oldValue !== updateObject[key]) {        
        // Save to file and return updated component 
        try {
            saveComponents(components);
            return component;             
        } catch(error) {
            throw new utils.RandomException(`There was an error saving the ${type}: ${typeToUpdateID}`);
        }
    } else {
        throw new utils.RandomException(`${typeUpper} "${typeToUpdateID}" not updated!`);
    }   
};

// ------------------------------------------------------------
// ADD, REMOVE, AND UPDATE VARIATIONS   
// ------------------------------------------------------------
var addVariation = (componentName, variationName) => {
    return adder(componentName, variationName, 'variation');
};

var removeVariation = (componentName, variationName) => {
    return remover(componentName, variationName, 'variation');
};

var updateVariation = (componentName, variationName, key, newValue) => {
    return updater(componentName, variationName, key, newValue, 'variation');
};


// ------------------------------------------------------------
// ADD, REMOVE, AND UPDATE MODIFIERS   
// ------------------------------------------------------------
var addModifier = (componentName, modifierName) => {
    return adder(componentName, modifierName, 'modifier');
};

var removeModifier = (componentName, modifierName) => {
    return remover(componentName, modifierName, 'modifier');
};

var updateModifier = (componentName, modifierName, key, newValue) => {
    return updater(componentName, modifierName, key, newValue, 'modifier');
};


// ------------------------------------------------------------
// ADD, REMOVE, AND UPDATE BREAKPOINTS   
// ------------------------------------------------------------
var addBreakpoint = (componentName, breakpointSize) => {
    return adder(componentName, breakpointSize, 'breakpoint');
};

var removeBreakpoint = (componentName, breakpointSize) => {
    return remover(componentName, breakpointSize, 'breakpoint');
};

var updateBreakpoint = (componentName, breakpointSize, key, newValue) => {
    return updater(componentName, breakpointSize, key, newValue, 'breakpoint');
};

// ------------------------------------------------------------
// ADD, REMOVE, AND UPDATE STATES   
// ------------------------------------------------------------
var addState = (componentName, stateName) => {
    return adder(componentName, stateName, 'state');
};

var removeState = (componentName, stateName) => {
    return remover(componentName, stateName, 'state');
};

var updateState = (componentName, stateName, key, newValue) => {
    return updater(componentName, stateName, key, newValue, 'state');
};


// ------------------------------------------------------------
// GET COMPONENTS AND FILTER FUNCTIONS  
// ------------------------------------------------------------
var fetchComponents = () => {
    // Load existing Components from pe-components file 
    try {
        return JSON.parse(fs.readFileSync(path.join(__dirname, "components.json")));
    } catch (error) {        
        // This writes the givin text to the file specified.
        try {
            fs.appendFileSync(__dirname + '/components.json', '[]', 'utf8');
            return JSON.parse(fs.readFileSync(path.join(__dirname, "components.json")));
        } catch (error) {
            return undefined;
        }        
    }    
};

var getAll = () => {
// Working
    var results = fetchComponents();
    if (results) {
        return results;
    } else {
        throw new utils.RandomException("Something went wrong while trying to fetch the data");
    }
};

var getComponent = (components, name) => {
// Working
    var results = components.find((component) => component.name === name);
    if (results) {
        return results;
    } else {
        throw new utils.RandomException('No results found when searching by: "name"')
    }
};

var getComponentsWithType = (components, type) => {
// Working
    var results = _.filter(components, { 'type': type});
    if (results.length > 0) {
        return results;
    } else {
        throw new utils.RandomException('No results found when searching by: "type"');
    }
};

var getComplete = (components) => {
// Working
    var results = _.filter(components, { 'complete': true});
    if (results.length > 0) {
        return results;
    } else {
        throw new utils.RandomException('No results found when searching by: "complete"');
    }    
}; 

var getIncomplete = (components) => {
// Working
    var results = _.filter(components, { 'complete': false});
    if (results.length > 0) {
        return results;
    } else {
        throw new utils.RandomException('No results found when searching by: "incomplete"');
    }
};

var getProperties = (component, properties) => {
    let property, cpath;
    let propertyPaths = ['name', 'type'];
    if (properties.length) {
        for (let i = 0; i < properties.length; i++) {
            // Build array of property paths
            property = properties[i];
            cpath = utils.createPathToProperty(component, properties[i], "")[0];
            propertyPaths.push(cpath);
            utils.resetMyObject();        
        }
    } else {
        cpath = utils.createPathToProperty(component, properties, "")[0];
        propertyPaths.push(cpath);        
    }
    // Use propertyPaths array to return new "picked" object     
    return _.pick(component, propertyPaths);
};


// ------------------------------------------------------------
// SAVE FUNCTION  
// ------------------------------------------------------------
var saveComponents = (components) => {
    // Rewrite the components file 
    fs.writeFileSync(path.join(__dirname, "components.json"), JSON.stringify(components));
};

module.exports = {
    // component methods
    addComponent,
    removeComponent,
    updateComponent,
    // variation methods
    addVariation,
    removeVariation,
    updateVariation, 
    // modifier methods
    addModifier,
    removeModifier,
    updateModifier,
    // breakpoint methods
    addBreakpoint,
    removeBreakpoint,
    updateBreakpoint,
    // state methods
    addState,
    removeState,
    updateState,
    // get methods
    getAll,
    getComponent,
    getComponentsWithType,
    getProperties,
    getComplete,
    getIncomplete
};