export class CheckersGame {
    paths;
    cells;
    init(currentGame) {
        for (let i in currentGame) {
            this[i] = currentGame[i];
        }
    }

    checkValidStep(from, to) {
        if (!this.checkDelta(from, to)) { return; }
        if (!this.isBusy(to)) { return; }
        if (!this.checkColor(to)) { return; }

        let hitChips = this.getHitChips(from, to);

        if (!this.checkFar(from, to, hitChips)) { return; }
       
        return hitChips;
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

    checkFar(from, to, hitChips) {
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

    getHitChips(from, to) {
        let range = this.paths[from[1]][from[0]],
            deltaX = to[0] - from[0],
            deltaY = to[1] - from[1],
            hitChips = [];
        
        if ((Math.abs(deltaY) === 2) && (Math.abs(deltaX) === 2)) {
            let hitPosX = from[0] + deltaX / 2,
                hitPosY = from[1] + deltaY / 2;
            let hitRange = this.paths[hitPosY][hitPosX];

            if ((range !== hitRange) && (hitRange !== 0)) { hitChips.push([hitPosX, hitPosY]); }
        }

        return hitChips;
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
