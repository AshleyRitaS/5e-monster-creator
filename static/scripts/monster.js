var monster5e = (function() {
    var crValues = [
        {
            name:   '0',
            prof:   2,
            ac:     13,
            hp:     7,
            attack: 3,
            damage: 2,
            save:   13
        }
    ];

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
                ['30',9,19,806,850,14,303,320,23]
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
            if (dCR === false && stats.hp > val.hpMin) {
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
            if (oCR === false && dpr > val.damageMin) {
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
    }

    function calculateDPR(stats) {
        return stats.damage;
    }

    function cloneStats(stats) {
        return {
            cr:     stats.cr,
            oCR:    stats.oCR,
            dCR:    stats.dCR,
            hp:     stats.hp,
            ac:     stats.ac,
            attack: stats.attack,
            save:   stats.save,
            damage: stats.damage
        }
    }
    
    function monster5e() {
        var permStats = {},
            events = {},
            monster = {};
        
        monster.on = function(eventName, callback) {
            if (events.hasOwnProperty(eventName)) {
                events[eventName].push(callback);
            } else {
                events[eventName] = [callback];
            }
        }
        monster.onChange = function(callback) {
            monster.on('change', callback);
        };
        
        function fireEvent(eventName) {
            if (eventName in events) {
                events[eventName].forEach(callback => {
                    callback(monster);
                });
            }
        }

        monster.setStats = function(stats) {
            var calcCR;
            calcCR = calculateCR(stats);
            permStats = cloneStats(stats);
            permStats.cr = calcCR.cr;
            permStats.oCR = calcCR.oCR;
            permStats.dCR = calcCR.dCR;
            fireEvent('change');
        }

        monster.getStats = function() {
            return cloneStats(permStats);
        }

        monster.execTest = function(code) {
            eval(code);
        }

        return monster;
    };

    return monster5e;
}());