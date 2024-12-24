
var utils = require('./utils');

class Room {
    constructor(name, secret) {
        this.name = name;
        this.secret = secret;
        this.players = [];
        this.drawing = 0;
        this.word = '';
        this.hiddenWord = '';
        this.words = [];
        this.clock = 60000;
        this.clockInterval = '';
        this.hintTimeout = '';
        this.skipTimeout = '';
    }

    checkEndRound(io) {
        if (this.howManyPlayersFound() === this.players.length - 1) {
            this.skipRound(io);
        }
    }

    skipRound(io) {
        this.players.forEach(player => {
            player.foundWord = false;
        });
        io.in(this.name).emit('chat', {text: this.word, end: true});
        this.switchRoles();
        this.clock = 60000;
        clearInterval(this.clockInterval);
        clearTimeout(this.hintTimeout);
        clearTimeout(this.skipTimeout);
    }

    howManyPlayersFound() {
        let total = 0;
        this.players.forEach(player => {
            if (player.foundWord)
                total += 1;
        });
        return total;
    }

    playerFoundWord(player) {
        switch (this.howManyPlayersFound()) {
            case 0:
                this.players.find(p => p.name === player).score += 500;
                break;
            case 1:
                this.players.find(p => p.name === player).score += 250;
                break;
            case 2:
                this.players.find(p => p.name === player).score += 150;
                break;
            case 3:
                this.players.find(p => p.name === player).score += 100;
                break;
            default:
                this.players.find(p => p.name === player).score += 50;
                break;
        }
        this.players.find(p => p.name === player).foundWord = true;
    }

    switchRoles() {
        this.drawing += 1;
        if (this.drawing >= this.players.length)
            this.drawing = 0;
        this.word = '';
        this.hiddenWord = '';
        this.words = utils.generateRdmWords();
        this.players.forEach(player => {
            if (player === this.players[this.drawing]) {
                player.socket.emit('draw', this.words);
            } else {
                player.socket.emit('guess', this.players[this.drawing].name);
            }
        });
    }

}

module.exports = Room ; 