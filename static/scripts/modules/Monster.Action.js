/**
 * 
 * @param {string} name 
 * @param {string} description 
 * @param {*} damage 
 * @param {*} actionCost 
 * @param {*} attackBonus 
 * @param {*} save 
 */
function Action(name, description, descriptionVariables, damage, actionCost, attackBonus, save) {};

function Attack(name, type, range, bonus, damage, damageType, hitDesc) {};

/**
 * Represents an object that holds actions belonging to a monster. Knows how to calculate average damage per round for first 3 rounds.
 * 
 * @constructor
 */
function ActionSet() {};

/**
 * Adds an Attack to the ActionSet
 * @param {Attack} attack - The Attack object to add to the set
 */
ActionSet.prototype.addAttack = function addAttack(attack) {};

/**
 * Calculates the average damage per round over 3 rounds of this ActionSet
 * @returns {number} The average damage per round.
 */
ActionSet.prototype.getDamage = function getDamage() {};

function MultiAttack() {};