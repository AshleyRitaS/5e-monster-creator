import {Monster} from '/static/scripts/monster.js'
var monster = new Monster();
monster.setStats(
    {
        hp:{val:80},
        ac:15,
        attack:3,
        save:13,
        damage:10,
        size:'large'
    }
);

console.log('After setStats:');
console.log(monster.getStats());

monster.setAttr({
    str:15,
    dex:18,
    con:14,
    int:8,
    wis:9,
    cha:3
});


console.log('After setAttr:');
console.log(monster.getStats());