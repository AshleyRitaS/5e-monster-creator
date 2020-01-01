import {DiceExp} from '/static/scripts/modules/DiceExp.js';

var crValues = (function() {
    var rawValues = [
            ['1/8',2,13,7,35,3,2,3,13],
            ['1/4',2,13,36,49,3,4,5,13],
            ['1/2',2,13,50,70,3,6,8,13],
            ['1',2,13,71,85,3,9,14,13],
            ['2',2,13,86,100,3,15,20,13],
            ['3',2,13,101,115,4,21,26,13],
            ['4',2,14,116,130,5,27,32,14],
            ['5',3,15,131,145,6,33,38,15],
            ['6',3,15,146,160,6,39,44,15],
            ['7',3,15,161,175,6,45,50,15],
            ['8',3,16,176,190,7,51,56,16],
            ['9',4,16,191,205,7,57,62,16],
            ['10',4,17,206,220,7,63,68,16],
            ['11',4,17,221,235,8,69,74,17],
            ['12',4,17,236,250,8,75,80,17],
            ['13',5,18,251,265,8,81,86,18],
            ['14',5,18,266,280,8,87,92,18],
            ['15',5,18,281,295,8,93,98,18],
            ['16',5,18,296,310,9,99,104,18],
            ['17',6,19,311,325,10,105,110,19],
            ['18',6,19,326,340,10,111,116,19],
            ['19',6,19,341,355,10,117,122,19],
            ['20',6,19,356,400,10,123,140,19],
            ['21',7,19,401,445,11,141,158,20],
            ['22',7,19,446,490,11,159,176,20],
            ['23',7,19,491,535,11,177,194,20],
            ['24',7,19,536,580,12,195,212,21],
            ['25',8,19,581,625,12,213,230,21],
            ['26',8,19,626,670,12,231,248,21],
            ['27',8,19,671,715,13,249,266,22],
            ['28',8,19,716,760,13,267,284,22],
            ['29',9,19,761,805,13,285,302,22],
            ['30',9,19,806,850,14,303,320,23],
            ['Above 30',9,19,851,Number.MAX_SAFE_INTEGER,14,321,Number.MAX_SAFE_INTEGER,23]
        ],
        output = [],
        i, val;
    
    for (i = 0; i < rawValues.length; i++) {
        val = rawValues[i];
        output[i] = {
            display:val[0],
            prof:val[1],
            ac:val[2],
            hpMin:val[3],
            hpMax:val[4],
            attack:val[5],
            damageMin:val[6],
            damageMax:val[7],
            save:val[8]
        }
    }
    return output;
}());

var sizes = {
    tiny:4,
    small:6,
    medium:8,
    large:10,
    huge:12,
    gargantuan:20
}

function copyStats(values) {
    values = values || {};
    values.attr = values.attr || {};
    values.hp = values.hp || {};

    var newStats = {
        attr:   {
                    str:Number(values.attr.str) || 10,
                    dex:Number(values.attr.dex) || 10,
                    con:Number(values.attr.con) || 10,
                    int:Number(values.attr.int) || 10,
                    wis:Number(values.attr.wis) || 10,
                    cha:Number(values.attr.cha) || 10,
                },
        ac:     Number(values.ac) || 13,
        attack: Number(values.attack) || 3,
        save:   Number(values.save) || 13,
        damage: Number(values.damage)|| 6
    };
    if (sizes.hasOwnProperty(values.size)) {
        newStats.size = values.size;
    } else {
        newStats.size = 'medium';
    }
    newStats.hp = values.hp || 10;
    newStats.attrMod = {
        str:Math.floor((newStats.attr.str - 10) / 2),
        dex:Math.floor((newStats.attr.dex - 10) / 2),
        con:Math.floor((newStats.attr.con - 10) / 2),
        int:Math.floor((newStats.attr.int - 10) / 2),
        wis:Math.floor((newStats.attr.wis - 10) / 2),
        cha:Math.floor((newStats.attr.cha - 10) / 2),
    }
    return newStats;
};
//returns an object representing the CR indicated by the Stats object it is passed
/*
return {
    cr: overall CR
    oCR: offensive CR
    dCR: defensive CR
}
*/
function calculateCR(stats) {
    var oCR = false,
        dCR = false,
        dpr = calculateDPR(stats),
        cr,
        acDiff,
        attackDiff,
        saveDiff,
        offDiff,
        i,
        val;
    
    for (i = 0; i < crValues.length && (oCR === false || dCR === false); i++) {
        val = crValues[i];
        if (dCR === false && stats.hp <= val.hpMax) {
            dCR = i;
            acDiff = stats.ac - val.ac;
            while (acDiff >= 2) {
                dCR++;
                acDiff -= 2;
            }
            while (acDiff <= -2) {
                dCR--;
                acDiff += 2;
            }
        }
        if (oCR === false && dpr <= val.damageMax) {
            oCR = i;
            attackDiff = stats.attack - val.attack;
            saveDiff = stats.save - val.save;
            offDiff = (Math.abs(attackDiff) > Math.abs(saveDiff)) ? attackDiff : saveDiff;
            while (offDiff >= 2) {
                dCR++;
                offDiff -= 2;
            }
            while (offDiff <= -2) {
                dCR--;
                offDiff += 2;
            }
        }
    }
    cr = Math.round((dCR + oCR)/2);
    return {
        cr:cr,
        oCR:oCR,
        dCR:dCR
    }
};

//Calculates average damage per round based on the stats object it is passed
function calculateDPR(stats) {
    return stats.damage;
}

function Monster() {
    var permStats = copyStats({}),
        cr = calculateCR(permStats),
        events = {},
        monster = {};
    
    this.on = function(eventName, callback) {
        if (events.hasOwnProperty(eventName)) {
            events[eventName].push(callback);
        } else {
            events[eventName] = [callback];
        }
    }
    this.onChange = function(callback) {
        monster.on('change', callback);
    };
    
    this.fireEvent = function(eventName) {
        if (events.hasOwnProperty(eventName)) {
            events[eventName].forEach(callback => {
                callback(monster);
            });
        }
    }

    this.setAttr = function(attr) {
        var tempStats = copyStats(permStats);
        Object.assign(tempStats.attr, attr);
        tempStats = copyStats(tempStats);
        var con = tempStats.attrMod.con;
        var hpDiceSize = sizes[tempStats.size];
        var hpMin = crValues[cr.cr].hpMin;
        var hpMax = crValues[cr.cr].hpMax;
        var hpDice = DiceExp.createWithinRange(hpMin, hpMax, hpDiceSize, con);
        if (hpDice) {
            tempStats.hp = hpDice;
            this.setStats(tempStats);
            return true;
        } else {
            return null;
        }
    }

    this.setStats = function(stats) {
        var values = copyStats(stats);
        var newCR = calculateCR(values);
        cr = newCR;
        permStats = copyStats(stats);
        this.fireEvent('change');
    }

    this.getStats = function() {
        return copyStats(permStats);
    }

    this.getCR = function() {
        return {
            cr:cr.cr,
            oCR:cr.oCR,
            dCR:cr.dCR
        }
    }
}

export {Monster};