function DiceExp(numberOfDiceOrString = 0, sizeOfDice = 0, staticModifier = 0, strict = DiceExp.strictSizes) {
    if (typeof numberOfDiceOrString === 'string') {
        return DiceExp.parseDiceExp(numberOfDiceOrString);
    }
    
    var numDice,
        diceSize,
        mod;
    
    {
        let values = cleanInput({
            numDice:numberOfDiceOrString,
            diceSize:sizeOfDice,
            mod:staticModifier
        }, strict);

        numDice = values.numDice;
        diceSize = values.diceSize;
        mod = values.mod;
    }
    
    this.valueOf = function() {
        return numDice * (diceSize+1)/2 + mod;
    }

    this.toString = function() {
        return numDice + 'd' + diceSize + (mod ? (mod > 0 ? '+' : '-') + Math.abs(mod) : '');
    }
}

function cleanInput(values = {}, strict = DiceExp.strictSizes) {
    values.numDice = Math.floor(values.numDice) || 0,
    values.diceSize = Math.floor(values.diceSize),
    values.mod = Math.floor(values.mod) || 0;

    if (isValidSize(values.diceSize, true)) {
        return values;
    }

    return null;
}

//returns true if size is valid, otherwise throws if throws = true or returns false
var isValidSize = function() {
    var validDiceSizes = {
        4:true,
        6:true,
        8:true,
        10:true,
        12:true,
        20:true,
        100:true,
    }
    return function isValidSize(size, throws = false, strict = DiceExp.strictSizes) {
        if (Number(size) !== Math.floor(size)) {
            if (throws) {
                throw new TypeError('diceSize must be an integer');
            }
            return false;
        } else if (strict && !validDiceSizes[size]) {
            if (throws) {
                throw new TypeError('diceSize must be a value in ' + validDiceSizes.toString());
            }
            return false;
        } else if (size <= 0) {
            if (throws) {
                throw new TypeError('diceSize must be positive');
            }
            return false;
        }
        return true;
    };
}();

//takes a string, returns a DiceExp
DiceExp.parseDiceExp = function(exp) {
    if (typeof exp !== 'string') {
        throw new TypeError('DiceExp.parseDiceExp requires a string');
    }
    exp.replace(/\s/g, '');
    var pattern = /(\d+)d(\d+)(?:([\+\-]\d+))?/;
    var matches = exp.match(pattern);
    if (matches) {
        let numDice = Number(matches[1]),
            diceVal = Number(matches[2]),
            addMod  = Number(matches[3]);
        return new DiceExp (numDice, diceVal, addMod);
    } else {
        return null;
    }
}

//Determines whether dieSize must be a real die type or not by default. Can be overridden on a per-call basis
DiceExp.strictSizes = false;


//creates a DiceExp with a value between min and max, using the provided die size and modifiers. If an expression cannot be created within range, returns null
DiceExp.createWithinRange = function(min, max, dieSize, modifierPerDie = 0, baseModifier = 0, strict = DiceExp.strictSizes) {
    if (!isValidSize(dieSize, true, strict)) {
        return null;
    }
    var valPerDie = (dieSize+1)/2 + Number(modifierPerDie),
        val = Number(baseModifier),
        count = 0;
    while (val < min) {
        val += valPerDie;
        count++;
    }
    if (val < max) {
        var modifier = modifierPerDie * count + baseModifier;
        return new DiceExp(count, dieSize, modifier);
    } else {
        return null;
    }
}

export {DiceExp};