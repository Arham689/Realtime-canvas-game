var fs = require("fs");
var text = fs.readFileSync('./words.txt', "utf-8");
const Words = text.split("\n");

exports.generateRdmWords = () => {
    let words = [];
    let rng = 0;

    for (let i = 0; i < 3; i++) {
        rng = Math.floor(Math.random() * Math.floor(Words.length - 1));
        words[i] = Words[rng];
    }
    return words;
}

exports.getListOfPlayers = (tmpRoom) => {
    let listPlayers = [];
    for(const player of tmpRoom.players) {
        listPlayers.push({name: player.name, score: player.score});
    }
    return listPlayers;
}

exports.getListOfRooms = (Rooms) => {
    if (!Rooms)
        return [];
    let roomInfoList = [];
    Object.values(Rooms).forEach(room => {
        roomInfoList.push({name: room.name, players: room.players.length});
    });
    return roomInfoList;
}

exports.hideWord = (word, hint) => {
    if (hint) {
        let tmpWord = word;
        let rdmLetter = '';
        word = word.replace(/\w/g, '_');
        do {
             rdmLetter = tmpWord.split('')[(Math.floor(Math.random() * (tmpWord.length - 1)))];
        } while (!rdmLetter.match(/\w/));
        word = word.replaceAt(tmpWord.indexOf(rdmLetter), rdmLetter);
    } else
        word = word.replace(/\w/g, '_');
    return word;
}

exports.compareWordsWithTolerance = (guess, word) => {
    let score = 0;
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === word[i])
            score += 1;
    }
    return (word.length - 1 === score && guess.length <= word.length) || (word.length === score && guess.length === word.length + 1);
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}