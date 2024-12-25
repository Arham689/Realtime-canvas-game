
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
        this.totalRound = 3 ; 
        this.currentRound = 0 ; 
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
        this.switchRoles(io);
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
                this.players[this.drawing].score += 100 ;
                break;
            case 1:
                this.players.find(p => p.name === player).score += 250;
                this.players[this.drawing].score += 100 ;
                break;
            case 2:
                this.players.find(p => p.name === player).score += 150;
                this.players[this.drawing].score += 75 ;
                break;
            case 3:
                this.players.find(p => p.name === player).score += 100;
                this.players[this.drawing].score += 75 ;
                break;
            default:
                this.players.find(p => p.name === player).score += 75;
                this.players[this.drawing].score += 50 ;
                break;
        }
        this.players.find(p => p.name === player).foundWord = true;
    }

    switchRoles(io) {
        this.drawing += 1;
        this.word = '';
        this.hiddenWord = '';
    

        if (this.drawing >= this.players.length) {
            this.drawing = 0;  
            this.currentRound++; 
        }
    
        if (this.currentRound >= this.totalRound) {
            let winner = this.players.reduce((max, player) => {
                return player.score > max.score ? player : max;
            }, this.players[0]);
            
            const winnerData = {
                name: winner.name,
                score: winner.score,
            };

            
            io.emit('winner', { roomName: this.name, winnerData });
    
            return; 
        }
    
        this.words = utils.generateRdmWords();
    
        // Notify each player of their role (draw or guess)
        this.players.forEach(player => {
            if (player === this.players[this.drawing]) {
                player.socket.emit('draw', this.words); // Notify drawing player
            } else {
                player.socket.emit('guess', this.players[this.drawing].name); // Notify guessing players
            }
        });
    }
    

}

module.exports = Room ; 