import { ThreeCommon } from 'src/app/game/common';

export class CheckersGame {
    paths;
    cells;
    hitsChips = {
        b: [],
        w: []
    };
    newQueen;
    whoWin;
    players;

    init(currentGame) {
        for (let i in currentGame) {
            this[i] = currentGame[i];
        }
    }

    checkTurn(userId) {
        console.log( this.players, userId );
    }

    isCellExist(to) {
        if (!to) { return }
        return ((this.paths[to[1]] !== undefined) && (this.paths[to[1]][to[0]] !== undefined));
    }

    checkNextStep(step) {
        if (!this.nextStep || (this.nextStep.length === 0)) { return true; }
       
        let matchesWithNextStep = false;
        this.nextStep.forEach(s => {
            if (ThreeCommon.compareArrays(s.from, step.from) && ThreeCommon.compareArrays(s.to, step.to)) {
                matchesWithNextStep = true;
            }
           
        });
        
        return matchesWithNextStep;
    }

    checkValidStep(from, to, isPossibleHits = false, onStep) {
        if (!this.isCellExist(to)) { return; }
        if (!this.checkDelta(from, to)) { return; }
        if (!this.isBusy(to)) { return; }
        if (!this.checkColor(to)) { return; }
        if (!this.checkDiagonal(from, to)) { return; }
        if (!isPossibleHits && !this.checkNextStep({from, to})) { return; }
        
        let isQueen = this.isQueen(from),
            hitChips;

        if (isQueen) {
            hitChips = this.getHitChipsByQueen(from, to);
            
            if (hitChips && !this.checkHits(hitChips)) { return; }
        } else {
            hitChips = this.getHitChips(from, to);

            if (!this.checkFarAndDirection(from, to, hitChips, isQueen)) { return; }
        }

        return hitChips;
    }

    checkHits(hitChips) {
        let flag = true;

        hitChips.forEach((hit, index) => {
            if (flag && hitChips[index + 1]) {
                flag = Math.abs(hitChips[index + 1][0] - hit[0]) > 1;
            }
        });

        return flag;
    }

    transformRange(range) {
        if (range === 'ww') {
            return 'w';
        } else if (range === 'bb') {
            return 'b';
        } else {
            return range;
        }
    }

    getChip(position) {
        return this.paths[position[1]][position[0]];
    }

    getRange(position) {
        let chip = this.getChip(position);

        return this.transformRange(chip);
    }

    isQueen(from) {
        let range = this.paths[from[1]][from[0]];
        
        return (range === 'bb' || range === 'ww');
    }

    checkDelta(from, to) {
        if ((from[0] === to[0]) && (from[1] === to[1])) {
            return false;
        } else {
            return true;
        }
    }

    isBusy(to) {
        return this.paths[to[1]][to[0]] === '0';
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
        
        if (range === 'w') {
            return deltaY === 1;
        } else if (range === 'b') {
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

            if (hitRange !== '0') { hitChips.push([fromX, fromY]); }

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
                hitPosY = from[1] + deltaY / 2,
                hitRange = this.transformRange(this.paths[hitPosY][hitPosX])

            if ((range !== hitRange) && (hitRange !== '0')) { hitChips.push([hitPosX, hitPosY]); }
        }

        return hitChips;
    }

    makeStep(step, stepsCount) {
        let hits = this.checkValidStep(step.from, step.to, false, true),
            multistep = !!stepsCount;
       
        if (hits !== undefined) {
            this.stepAction(step, hits, multistep);
        } 
      
        return hits;
    }

    getTurn() {
        return this.whosTurn;
    }

    setTurn(range, pos, withHit = false) {
        let hits;
        
        if (withHit) {
            hits = this.checkAttack(pos);
        }

        if (!hits || (hits.length === 0)) {
            this.whosTurn = this.transformRange(range) === 'w' ? 'b' : 'w';
        }
    }

    stepAction(step, hits, multistep) {   
        let userRange = this.paths[step.from[1]][step.from[0]],
            withHit = hits && hits.length;
        this.paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
        this.paths[step.from[1]][step.from[0]] = '0';

        if (withHit) {
            hits.forEach(h => {
                let range = this.paths[h[1]][h[0]];
                this.paths[h[1]][h[0]] = '0';

                if (this.transformRange(range) === 'b') {
                    this.hitsChips.w.push(range);
                } else if (this.transformRange(range) === 'w') {
                    this.hitsChips.b.push(range);
                }
            })
        }
        
        this.postStepProcessor(step, userRange, withHit, multistep); 
    }

    postStepProcessor(step, userRange, withHit, multistep) {
        let range = this.paths[step.to[1]][step.to[0]];
       
        if (!this.isQueen(step.to)) {
            this.newQueen = this.detectQueen(step.to, range);
            
            if (this.newQueen) { this.paths[this.newQueen[1]][this.newQueen[0]] = range === 'w' ? 'ww' : 'bb'; }
        } else if (!multistep && !this.newQueen) {
            this.newQueen = null;
        }
        
        this.setTurn(userRange, step.to, withHit);
       
        if (this.whosTurn === this.transformRange(range)) {
            this.setNextStep(step);
        } else {
            this.nextStep = [];
        }

        this.whoWin = this.isGameOver();
    }

    checkAttack(pos) {
        let hits = this.getPosibleHits(pos);

        return hits;
    }

    getNeighboring(name) {
        let possiblePaths = [[], [], [], [] ];

        possiblePaths = [
            [name[0] - 1, name[1] + 1], //frontLeft
            [name[0] + 1, name[1] + 1], //frontRight
            [name[0] - 1, name[1] - 1], //backLeft
            [name[0] + 1, name[1] - 1] //backRight
        ];

        possiblePaths = possiblePaths.map(p => {
            if (!this.isCellExist(p) || !this.isBusy(p)) {
                p = [];
            }

            return p;
        })

        return possiblePaths;
    }

    getLastCells(name) {
        let possiblePaths = [[], [], [], [] ], i = 2;
       
        if (!this.isQueen(name)) {
            possiblePaths = [
                [[name[0] - 2, name[1] + 2]], //frontLeft
                [[name[0] + 2, name[1] + 2]], //frontRight
                [[name[0] - 2, name[1] - 2]], //backLeft
                [[name[0] + 2, name[1] - 2]] //backRight
            ];
        } else {
            while (this.isCellExist([name[0] - i, name[1] + i])) { //frontLeft
                possiblePaths[0].push([name[0] - i, name[1] + i]); 
                i++;
            }
    
            i = 2;
    
            while (this.isCellExist([name[0] + i, name[1] + i])) { //frontRight
                possiblePaths[1].push([name[0] + i, name[1] + i]); 
                i++;
            }
    
            i = 2;
    
            while (this.isCellExist([name[0] - i, name[1] - i])) { //backLeft
                possiblePaths[2].push([name[0] - i, name[1] - i]); 
                i++;
            }
    
            i = 2;
    
            while (this.isCellExist([name[0] + i, name[1] - i])) { //backRight
                possiblePaths[3].push([name[0] + i, name[1] - i]); 
                i++;
            }
        }

        return possiblePaths;
    }

    getPosibleHits(name) {
        let possiblePaths = this.getLastCells(name),
            hits = [];
    
        possiblePaths.forEach(tos => {
            tos.forEach(to => {
                let h = this.checkValidStep(name, to, true);
                
                if (h && h.length) {
                    hits.push({hits: h, to, from: name});
                }
            });
        });
        
        return hits;
    }

    setNextStep(step = null) {
        this.nextStep = [];

        if (step) {
            let hits = this.getPosibleHits(step.to);
                       
            if (hits && hits.length) {
                this.nextStep = this.nextStep.concat(hits);
            }
        } else {
            this.paths.forEach((row, rowIndex) => {
                row.forEach((chip, colIndex) => {
                    let range = this.transformRange(chip);
                    
                    if (range === this.whosTurn) {
                        let hits = this.getPosibleHits([colIndex, rowIndex]);
                       
                        if (hits && hits.length) {
                            this.nextStep = this.nextStep.concat(hits);
                        }
                    }
                })
            });
        }
    }

    isGameOver() {
        let whoWin;
        
        if (this.hitsChips['w'].length === 12) {
            whoWin = 'w';
        } else if (this.hitsChips['b'].length === 12) {
            whoWin = 'b';
        }

        let bestStep = this.getPosibleSteps(),
            hits = this.getAllPossibleHits();
       
        if ((bestStep.length === 0) && (hits.length === 0)) {
            whoWin = this.whosTurn === 'b' ? 'w' : 'b';
        }
       
        return whoWin;
    }

    detectQueen(cellPos, range) {
        if (((cellPos[1] === 7) && (range === 'b')) || ((cellPos[1] === 0) && (range === 'w'))) {
            return cellPos;
        }
    }

    canTouch(from, playerRange, isPossibleHits) {
        let validRange,
            matchesWithNextStep,
            error = [],
            range = this.paths[from[1]][from[0]];
        
        if (this.nextStep && this.nextStep.length) {
            this.nextStep.forEach(step => {
                if (ThreeCommon.compareArrays(step.from, from)) {
                    matchesWithNextStep = true;
                }
            });
        } else {
            matchesWithNextStep = true;
        }

        if (!matchesWithNextStep && !isPossibleHits) { error.push(' wrong_step '); }

        if (this.transformRange(playerRange) !== this.transformRange(range)) {
            error.push('not_your_range');
        }

        if (this.whosTurn !== this.transformRange(range)) {
            error.push(' not_your_turn ');
        }

        return error;
    }

    getPosibleSteps() {
        let bestStep = [];
        this.paths.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                let range = this.transformRange(this.paths[rowIndex][colIndex]);

                if ((this.paths[rowIndex][colIndex] !== 0) && (range === this.whosTurn)) {     
                    const s = this.getPossibleStep([colIndex, rowIndex]);
                    
                    if (s && s.length) {
                        bestStep = bestStep.concat(s);
                    }
                }
            });
        });

        return bestStep;
    }

    getAllPossibleHits() {
        let hits = [];
        this.paths.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                let range = this.transformRange(this.paths[rowIndex][colIndex]);

                if ((this.paths[rowIndex][colIndex] !== 0) && (range === this.whosTurn)) {     
                    const hit = this.getPosibleHits([colIndex, rowIndex]);
                    
                    if (hit && hit.length) {
                        hits.push(hit);
                    }
                }
            });
        });

        return hits;
    }

    getPossibleStep(from) {
        let n = this.getNeighboring(from),
            steps = [];
        
        n.forEach(s => {
            if (s.length) {
                let hitChips = this.checkValidStep(from, s, false, true);
                
                if (hitChips) {
                    steps.push({hitChips: [], step: {from: from, to: s}})
                }
            }
        })

        return steps;
    }
}

export class StepGenerator {
    initialObj = {};
    game = {};

    constructor() {
        // this.reset = this.reset.bind(this);
    }

    copy(from, to, i = false) {
        for (let u in from) {
            let type = {}.toString.call(from[u]).slice(8, -1);

            switch (type) {
                case 'Array':
                    to[u] = ThreeCommon.copyArray(from[u]);
                    break;
                case 'Object':
                    to[u] = ThreeCommon.copyObj(from[u]);
                    break;
                case 'Function':
                    if(!i) to[u] = from[u].bind(to);
                    break;
                default:
                    to[u] = from[u];
                    break;
            }
        }
    }

    init(game) {  
        this.copy(game, this.initialObj);
        this.copy(game, this.game);
    }

    reset() {
        this.copy(this.initialObj, this.game, true);
    }

    getStep() {
        let range = this.game.whosTurn,
            paths = this.game.paths,
            bestStep = [];

        this.game.setNextStep();
        let nextStep = this.game.nextStep.slice();
        this.reset();
        
        if (nextStep.length) { 
            let hitsStep = [];
            nextStep.forEach(step => {
                let possibleStep = [];
                let hits = this.getAllHits([step.from[0], step.from[1]], possibleStep);
                hitsStep.push(possibleStep);
                this.reset();
            });
            bestStep = this.getBestHitStep(hitsStep);
            bestStep = this.formatStep(bestStep);
        } else {
            bestStep = this.game.getPosibleSteps();
            bestStep = this.getBestStep(bestStep);
        }
    
        return {steps: bestStep, game: this.game};
    }

    getBestStep(steps) {
        return [steps[0]];
    }

    getBestHitStep(steps) {
        let best = [];
        
        steps.forEach(step => {
            if (step && step.length && (best.length < step.length)) {
                best = step;
            }
        });

        if (best.length === 0) {
            best = steps[0];
        }

        return best;
    }

    formatStep(steps) {
        steps = steps.map(step => {
            step = {hitChips: step[0].hits, step: {from: step[0].from, to: step[0].to}};
            return step;
        });

        return steps;
    }

    getAllHits(name, possibleHits) {
        let hits = this.game.getPosibleHits([name[0], name[1]]);

        if (hits.length) {
            possibleHits.push(hits);
            this.game.makeStep(hits[0]);
            this.getAllHits(hits[0].to, possibleHits)
        }
    }
}

export class Giveaway extends CheckersGame {
    maxHits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    constructor() {
        super();
    }
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