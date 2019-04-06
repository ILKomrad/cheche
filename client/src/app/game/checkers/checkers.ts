export class CheckersGame {
    paths;
    cells;
    hitsChips = {
        b: [],
        w: []
    };
    init(currentGame) {
        for (let i in currentGame) {
            this[i] = currentGame[i];
        }
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

    transformRange(range) {
        if (range === 22) {
            return 2;
        } else if (range === 11) {
            return 1;
        } else {
            return range;
        }
    }

    getChip(position) {
        return this.paths[position[1]][position[0]];
    }

    isQueen(from) {
        let range = this.paths[from[1]][from[0]];
        
        return (range === 11 || range === 22);
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

    checkDiagonal(from, to) {
        let deltaX = from[0] - to[0];
        return ((from[1] + deltaX) === to[1]) || 
        ((from[1] + Math.abs(deltaX)) === to[1]) ||
        ((from[1] - Math.abs(deltaX)) === to[1]);
    }

    checkFarAndDirection(from, to, hitChips, isQueen) {
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

            if (range === hitRange) { 
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
                hitPosY = from[1] + deltaY / 2,
                hitRange = this.transformRange(this.paths[hitPosY][hitPosX])

            if ((range !== hitRange) && (hitRange !== 0)) { hitChips.push([hitPosX, hitPosY]); }
        }

        return hitChips;
    }

    makeStep(step) {
        let hits = this.checkValidStep(step.from, step.to);
        
        if (hits !== undefined) {
            this.stepAction(step, hits);
        } 

        return hits;
    }

    stepAction(step, hits) {   
        this.paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
        this.paths[step.from[1]][step.from[0]] = 0;

        if (hits && hits.length) {
            hits.forEach(h => {
                let range = this.paths[h[1]][h[0]];
                this.paths[h[1]][h[0]] = 0;

                if (range === 2) {
                    this.hitsChips.w.push(range);
                } else if (range === 1) {
                    this.hitsChips.b.push(range);
                }
            })
        }
    }
}

export class Giveaway extends CheckersGame {
    
}

export class Checkers {
    static getGame(currentGame) {
        let type = currentGame.type;
        let game;

        switch (type) {
            case 'giveaway':
                game = new Giveaway();
                game.init(currentGame);
                
                break;
        }

        return game;
    }
}
