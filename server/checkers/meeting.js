class Meeting {
    constructor() {
        this.score = []; // {player: {id: numb, category: string, name: string}}
        this.games = [];
    }

    addGame(game) {
        this.games.push({id: game.id, type: game.type});
    }

    addPlayer(player) {
        this.score.push(player);
    }

    getCurrentGame() {
        return this.currentGame;
    }

    setCurrentGame(gameId, type) {
        this.currentGame = {id: gameId, type: type};
    }

    setId(id) {
        this.id = id;
    }
}

module.exports = Meeting;