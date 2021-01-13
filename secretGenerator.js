const { adjs, nouns } = require("./words");

function secretGenerator() {
    const ranAdj = adjs[Math.floor(Math.random() * adjs.length)];
    const ranNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${ranAdj} ${ranNoun}`;
}

module.exports = secretGenerator;
