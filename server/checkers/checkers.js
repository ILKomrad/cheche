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

    setData(currentGame) {
        for (let i in currentGame) {
            this[i] = currentGame[i];
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
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0]
        ];
        this.hitsChips = {
            'w': [],
            'b': []
        };
        this.whosTurn = null;
        this.whoWin = null;
        this.players = [];
    }

    checkValidStep(from, to) {
        if (!this.checkDelta(from, to)) { return; }
        if (!this.isBusy(to)) { return; }
        if (!this.checkColor(to)) { return; }
        if (!this.checkDiagonal(from, to)) { return; }
        let isQueen = this.isQueen(from),
            hitChips;

        if (isQueen) {
            hitChips = this.getHitChipsByQueen(from, to)
        } else {
            hitChips = this.getHitChips(from, to);

            if (!this.checkFarAndDirection(from, to, hitChips, isQueen)) { return; }
        }
        
        return hitChips;
    }

    makeStep(step) {
        let hits = this.checkValidStep(step.from, step.to);

        if (hits !== undefined) {
            this.stepAction(step, hits);
        }

        this.postStepProcessor(step);
    }

    postStepProcessor(step) {
        let range = this.paths[step.to[1]][step.to[0]];
       
        if (!this.isQueen(step.to)) {
            this.newQueen = this.detectQueen(step.to, range);

            if (this.newQueen) { this.paths[this.newQueen[1]][this.newQueen[0]] = range === 1 ? 11 : 22; }
        } else {
            this.newQueen = null;
        }

        this.whoWin = this.isGameOver();
    }

    isGameOver() {
        let whoWin = null;

        if (this.hitsChips['w'].length === 12) {
            whoWin = 'w';
        } else if (this.hitsChips['b'].length === 12) {
            whoWin = 'b';
        }

        return whoWin;
    }

    detectQueen(cellPos, range) {
        if (((cellPos[1] === 7) && (range === 2)) || ((cellPos[1] === 0) && (range === 1))) {
            return cellPos;
        }
    }

    stepAction(step, hits) {   
        this.paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
        this.paths[step.from[1]][step.from[0]] = 0;

        if (hits && hits.length) {
            hits.forEach(h => {
                let range = this.paths[h[1]][h[0]];
                this.paths[h[1]][h[0]] = 0;

                if (this.transformRange(range) === 2) {
                    this.hitsChips.w.push(range);
                } else if (this.transformRange(range) === 1) {
                    this.hitsChips.b.push(range);
                }
            })
        }
    }

    isQueen(from) {
        let range = this.paths[from[1]][from[0]];
        
        return (range === 11 || range === 22);
    }

    checkDiagonal(from, to) {
        let deltaX = from[0] - to[0];
        return ((from[1] + deltaX) === to[1]) || 
        ((from[1] + Math.abs(deltaX)) === to[1]) ||
        ((from[1] - Math.abs(deltaX)) === to[1]);
    }

    checkDelta(from, to) {
        if ((from[0] === to[0]) && (from[1] === to[1])) {
            return false;
        } else {
            return true;
        }
    }

    isBusy(to) {
        return this.paths[to[1]][to[0]] === 0;
    }

    checkColor(to) {
        return this.cells[to[1]][to[0]] === 'b';
    }

    checkFarAndDirection(from, to, hitChips) {
        let range = this.paths[from[1]][from[0]],
            deltaX = Math.abs(from[0] - to[0]),
            deltaY = from[1] - to[1];
        
        if ((deltaX > 2) || (Math.abs(deltaY) > 2)) { return; }
        
        if ((Math.abs(deltaY) === 2) && (deltaX === 2)) {
           return hitChips.length !== 0;
        }
        
        if (range === 1) {
            return deltaY === 1;
        } else if (range === 2) {
            return deltaY === -1;
        }
    }

    getHitChipsByQueen(from, to) {
        let directionX = ((to[0] - from[0]) > 0) ? 1 : -1,
            directionY = ((to[1] - from[1]) > 0) ? 1 : -1,
            fromX = from[0],
            fromY = from[1],
            toX = to[0],
            toY = to[1],
            hitChips = [],
            range = this.transformRange(this.paths[from[1]][from[0]]);
        
        while (fromX !== toX) {
            fromX += 1 * directionX;
            fromY += 1 * directionY;
            let hitRange = this.paths[fromY][fromX];

            if (hitRange !== 0) { hitChips.push([fromX, fromY]); }

            if (range === this.transformRange(hitRange)) { 
                hitChips = undefined;  
                break;
            }
        }

        return hitChips;
    }

    getHitChips(from, to) {
        let range = this.paths[from[1]][from[0]],
            deltaX = to[0] - from[0],
            deltaY = to[1] - from[1],
            hitChips = [];
        
        if ((Math.abs(deltaY) === 2) && (Math.abs(deltaX) === 2)) {
            let hitPosX = from[0] + deltaX / 2,
                hitPosY = from[1] + deltaY / 2;
            let hitRange = this.transformRange(this.paths[hitPosY][hitPosX]);

            if ((range !== hitRange) && (hitRange !== 0)) { hitChips.push([hitPosX, hitPosY]); }
        }

        return hitChips;
    }

    transformRange(range) {
        if (range === 22) {
            return 2;
        } else if (range === 11) {
            return 1;
        } else {
            return range;
        }
    }
}

module.exports = Checkers;