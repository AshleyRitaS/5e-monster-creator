import { DiceExp } from "./DiceExp";

/**
 * Represents a monster.
 * @constructor
 * @param {number} cr - The challenge rating of the monster to be created
 * @todo Implement
 */
function Monster(cr) {
    
}

/**
 * Locks a set of stats on the object. Locked stats will never be altered as a side effect of another function, except as noted in documentation.
 * Locked stats may still be altered by their alter{Stat} function
 * @param {Object} newLocks - An object with keys representing the stat(s) to lock. Truthy values lock the key, false values unlock them.
 * @returns {Object} An object representing the new complete set of locks.
 * @todo Implement function
 */
Monster.prototype.setLocks = function setLocks(newLocks) {};

/**
 * Alters overall CR by 1 step. Keeps the difference between offensive and defensive CR the same.
 * Ignores locks on offensive and defensive CR.
 * @param {boolean} increase - Whether to increase or decrease CR.
 * @returns {?number} New CR if successful, null if not.
 * @todo Implement function
 */
Monster.prototype.alterCR = function alterCR(increase) {};

/**
 * Alters offensive CR by 1 step. Prefers to alter overall CR rather than defensive CR.
 * If both overall and defensive CR are locked, fails.
 * @param {boolean} increase - Whether to increase or decrease offensive CR
 * @returns {?number} New offensive CR if successful, null if not.
 * @todo Implement function
 */
Monster.prototype.alterOffensiveCR = function alterOffensiveCR(increase) {};

/**
 * Alters defensive CR by 1 step. Prefers to alter overall CR rather than offensive CR.
 * If both overall and offensive CR are locked, fails.
 * @param {boolean} increase - Whether to increase or decrease defensive CR
 * @returns {?number} New defensive CR if successful, null if not.
 * @todo Implement function
 */
Monster.prototype.alterDefensiveCR = function alterDefensiveCR(increase) {};

/**
 * Alters overall HP up or down by 1 die.
 * @param {boolean} increase - Whether to increase or decrease HP.
 * @param {number} [maxConChange=0] - The maximum change allowed on con score. Only modifies con if defensive CR is locked. 
 * @returns {?DiceExp} New HP value if successful, null if not.
 * @todo Implement function
 */
Monster.prototype.alterHP = function alterHP(increase, maxConChange = 0) {};

/**
 * Sets the value of an attribute score. Prefers not to alter CR if possible.
 * @param {string} attrName - The name of the attribute to modify or its abbreviation
 * @param {number} newScore - The value to set the attribute to.
 * @returns {?number} New attribute value if successful, null if not.
 * @todo Implement function
 */
Monster.prototype.alterAttr = function alterAttr(attrName, newScore) {};

/**
 * Sets AC value. In order, prefers to alter: HP, defensive CR, overall CR.
 * @param {number} newAC - The new value for AC
 * @returns {?number} New AC value if successful, null if not
 */
Monster.prototype.alterAC = function alterAC(newAC) {};

/**
 * Adds a new trait to the creature. Can either use an existing trait object or create a new one.
 * @param {Monster.Trait|string} - Either a Trait object or a string representing the name of the trait.
 * @param {string} [description] - A description of the trait. Only used if a name is given.
 * @param {function([Stats]):?Stats} [effectOnCR] - A function which takes a Monster.Stats object and returns either a modified object to use for CR purposes or null.
 * @returns {?number} An ID number to identify the trait, or null if the trait cannot be added.
 */
Monster.prototype.addTrait = function addTrait(traitOrName, description, effectOnCR = function(){return null}) {};

/**
 * Removes a trait from the creature.
 * @param {number} [id] - The id of the trait to be removed. If not provided, removes the most recent trait
 * @returns {?Monster.Trait} The removed trait, or null if no trait was removed (either due to invalid id or locks).
 */
Monster.prototype.removeTrait = function removeTrait(id) {};

/**
 * 
 */
Monster.prototype.addAction = function addAttack(name, isMelee, isWeapon, target, range, maxRange, attribute, baseDice) {};

export {Monster};