class Checkers {
    constructor(type) {
        this.type = type;
    }   

    setPaths(paths) {
        this.paths = paths;
    }

    getPaths() {
        return this.paths;
    }

    addPlayer(id) {
        if (this.players.length === 0) {
            this.players.push({id, range: 'w'});
        } else {
            this.players.push({id, range: 'b'});
        }
    }

    init() {
        this.cells = [
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w'],
            ['w', 'b', 'w', 'b', 'w', 'b', 'w', 'b'],
            ['b', 'w', 'b', 'w', 'b', 'w', 'b', 'w']
        ]; 
        this.paths = [
            [0, 0, 0, 2, 0, 2, 0, 2],
            [0, 0, 2, 0, 2, 0, 2, 0],
            [0, 0, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
        this.hitsChips = {
            'w': [],
            'b': []
        };
        this.whoseTurn = 1;
        this.whoWin = null;
        this.players = [];
    }
}

module.exports = Checkers;