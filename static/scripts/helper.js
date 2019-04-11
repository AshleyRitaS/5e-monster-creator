var ashCodes = ashCodes || {};
ashCodes.helper = (function() {
    var helper = {};
    //Accepts a dice code, i.e. 4d8+3, and returns the average roll
    helper.readDiceCode = function (diceCode) {
        var pattern = /(\d+)d(\d+)(?:\s*\+\s*(\d)){0,1}/;
        var matches = diceCode.match(pattern);
        if (matches) {
            var numDice = matches[1],
                diceVal = matches[2],
                addMod  = matches[3],
                dieAverage;
            dieAverage = (diceVal + 1)/2;
            return numDice * dieAverage + (addMod ? addMod : 0);
        } else {
            return null;
        }
    };
    return helper;
}());