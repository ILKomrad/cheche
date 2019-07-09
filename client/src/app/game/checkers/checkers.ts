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
    nextStep;
    whosTurn;

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

    checkValidStep(from, to, isPossibleHits = false, paths = null) {
        if (!this.isCellExist(to)) { return; }
        if (!this.checkDelta(from, to)) { return; }
        if (!this.isBusy(to, paths)) { return; }
        if (!this.checkColor(to)) { return; }
        if (!this.checkDiagonal(from, to)) { return; }
        if (!isPossibleHits && !this.checkNextStep({from, to})) { return; }
       
        let isQueen = this.isQueen(from, paths),
            hitChips;

        if (isQueen) {
            hitChips = this.getHitChipsByQueen(from, to, paths);
            // if (hitChips && !this.checkHits(hitChips)) { return; } // dont need becose check (hitChips.length >= 2) in getHitChipsByQueen
        } else {
            hitChips = this.getHitChips(from, to, paths);

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

    isQueen(from, paths = null) {
        const _paths = paths ? paths : this.paths,
            range = _paths[from[1]][from[0]];
        
        return (range === 'bb' || range === 'ww');
    }

    checkDelta(from, to) {
        if ((from[0] === to[0]) && (from[1] === to[1])) {
            return false;
        } else {
            return true;
        }
    }

    isBusy(to, p = null) {
        const paths = p ? p : this.paths;
        return paths[to[1]][to[0]] === '0';
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

    getHitChipsByQueen(from, to, paths = null) {
        const _paths = paths ? paths : this.paths;
        let directionX = ((to[0] - from[0]) > 0) ? 1 : -1,
            directionY = ((to[1] - from[1]) > 0) ? 1 : -1,
            fromX = from[0],
            fromY = from[1],
            toX = to[0],
            toY = to[1],
            hitChips = [],
            range = this.transformRange(_paths[from[1]][from[0]]);
        
        while (fromX !== toX) {
            fromX += 1 * directionX;
            fromY += 1 * directionY;
            let hitRange = _paths[fromY][fromX];
            
            if (hitRange !== '0') { hitChips.push([fromX, fromY]); }

            if ((range === this.transformRange(hitRange)) || (hitChips.length >= 2) || (hitRange === 'h')) {
                hitChips = undefined;  
                break;
            }
        }

        return hitChips;
    }

    getHitChips(from, to, paths = null) {
        const _paths = paths ? paths : this.paths;
        let range = _paths[from[1]][from[0]],
            deltaX = to[0] - from[0],
            deltaY = to[1] - from[1],
            hitChips = [];
        
        if ((Math.abs(deltaY) === 2) && (Math.abs(deltaX) === 2)) {
            let hitPosX = from[0] + deltaX / 2,
                hitPosY = from[1] + deltaY / 2,
                hitRange = this.transformRange(_paths[hitPosY][hitPosX])

            if ((range !== hitRange) && (hitRange !== '0') && (hitRange !== 'h')) { hitChips.push([hitPosX, hitPosY]); }
        }

        return hitChips;
    }

    makeStep(step, stepsCount) {
        let hits = this.checkValidStep(step.from, step.to),
            multistep = !!stepsCount;
       
        if (hits !== undefined) {
            this.stepAction(step, hits, multistep);
        } 
       
        return hits;
    }

    getTurn() {
        return this.whosTurn;
    }

    setTurn(range, step, withHit = false) {
        let hits;
        
        if (withHit) {
            hits = this.checkAttack(step);
        }
        
        if (!hits || (hits.length === 0)) {
            this.whosTurn = this.transformRange(range) === 'w' ? 'b' : 'w';
            this.removeHits();
        }
    }

    removeHits() {
        this.paths = this.paths.map(row => {
            row = row.map(col => {
                if (col === 'h') {
                    col = '0';
                }

                return col;
            })

            return row;
        })
    }

    stepAction(step, hits, multistep) {   
        let userRange = this.paths[step.from[1]][step.from[0]],
            withHit = hits && hits.length;
        this.paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
        this.paths[step.from[1]][step.from[0]] = '0';

        if (withHit) {
            hits.forEach(h => {
                let range = this.paths[h[1]][h[0]];
                this.paths[h[1]][h[0]] = 'h';

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
        this.setTurn(userRange, step, withHit);
      
        if (this.whosTurn === this.transformRange(range)) {
            this.setNextStep(step);
        } else {
            this.nextStep = [];
        }
        this.whoWin = this.isGameOver();
    }

    checkAttack(step) {
        let hits = this.getPosibleHits(step.to);

        return hits;
    }

    getNeighboring(name) {
        let possiblePaths = [
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
        });

        if (this.isQueen(name)) {
            let steps = this.getLastCells(name);
            steps.forEach(step => {
                if (step.length) { possiblePaths = possiblePaths.concat(step); }
            });
        }
        
        return possiblePaths;
    }

    getLastCells(name, paths = null) {
        let possiblePaths = [[], [], [], [] ], i = 2;
       
        if (!this.isQueen(name, paths)) {
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

    getPosibleHits(cellName, paths = null) {
        let possiblePaths = this.getLastCells(cellName, paths),
            hits = [],
            _to = [];
        
        possiblePaths.forEach(tos => {
            let flag = false;
            
            if (this.isQueen(cellName)) {
                tos.forEach(to => {
                    let h = this.checkValidStep(cellName, to, true, paths);
                    
                    if (h && h.length && this.getFakeHits({from: cellName, to})) {
                        flag = true;
                    }
                });
            }

            tos.forEach(to => {
                let h = this.checkValidStep(cellName, to, true, paths);
                
                if (h && h.length && (!flag || this.getFakeHits({from: cellName, to}))) {
                    hits.push({hits: h, to, from: cellName});
                }
            });
        });

        return hits;
    }

    getFakeHits(step) {
        const paths = ThreeCommon.copyArray(this.paths),
            _hits = this.checkValidStep(step.from, step.to, true, paths);

        if (_hits && _hits.length) {
            const h = _hits[0];
            paths[step.from[1]][step.from[0]] = '0';
            paths[h[1]][h[0]] = 'h';
            paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
            let hits = this.getPosibleHits(step.to, paths);
            
            return (hits.length >= 1);
        } else {
            return;
        }
    }

    setNextStep(step = null, fakePaths = null) {
        let nextStep = [], paths = fakePaths ? fakePaths : this.paths;
        
        if (step) {
            let hits = this.getPosibleHits(step.to, paths);
                       
            if (hits && hits.length) {
                nextStep = nextStep.concat(hits);
            }
        } else {
            paths.forEach((row, rowIndex) => {
                row.forEach((chip, colIndex) => {
                    let range = this.transformRange(chip);
                
                    if (range === this.whosTurn) {
                        let hits = this.getPosibleHits([colIndex, rowIndex], paths);
                       
                        if (hits && hits.length) {
                            nextStep = nextStep.concat(hits);
                        }
                    }
                })
            });
        }

        if (!fakePaths) {
            this.nextStep = nextStep;
        } else {
            return nextStep;
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

    getPosibleSteps(p = null) {
        let bestStep = [], paths = p ? p : this.paths;
        paths.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                let range = this.transformRange(paths[rowIndex][colIndex]);

                if ((paths[rowIndex][colIndex] !== 0) && (range === this.whosTurn)) {     
                    const s = this.getPossibleStep([colIndex, rowIndex], paths);
                    
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

    getPossibleStep(from, paths) {
        let n = this.getNeighboring(from),
            steps = [];
        
        n.forEach(s => {
            if (s.length) {
                let hitChips = this.checkValidStep(from, s, true, paths);
                
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
    game = new CheckersGame();
    deep = 0;

    constructor(level) {
        this.setLevel(level);
    }

    setLevel(level) {
        switch (level) {
            case 'primitive':
                this.deep = 0;
                break;
            case 'beginner':
                this.deep = 1;
                break;
        }
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

    getStep(p = null) {
        let range = this.game.whosTurn,
            paths = p ? p : this.game.paths,
            bestStep = [];

        this.game.setNextStep();

        if (this.game.nextStep.length) { 
            let nextStep = this.game.nextStep.slice();
            let hitsStep = this.getAllHits(nextStep);
            bestStep = this.rateHitSteps(hitsStep);
            bestStep = this.getBestHitStep(bestStep);
            bestStep = this.formatStep(bestStep);
        } else {
            // bestStep = this.game.getPosibleSteps();
            bestStep = this.rateSteps();
            bestStep = this.getBestStep(bestStep);
        }
        
        return {steps: bestStep, game: this.game};
    }

    rateHitStep(step, rate, range, paths) {
        step.forEach(h => {
            this.makeFakeStep(range, h, null, paths);
        });
        const nextStep = this.game.setNextStep(null, paths);
        let hitsStep = this.getAllHits(nextStep);
        rate.opponentHits += hitsStep.length;
    }

    rateHitSteps(steps) {
        steps = steps.map(step => {
            const paths = ThreeCommon.copyArray(this.game.paths),
                range = this.game.transformRange(paths[step[0].from[1]][step[0].from[0]]),
                rate = {opponentHits: 0};

            for (let z = 0; z < this.deep; z++) {
                this.rateHitStep(step, rate, range, paths);
            }
            this.game.whosTurn = range;
           
            return {
                hits: step.length,
                steps: step,
                opponentHits: rate.opponentHits
            }
        })
        return steps;
    }

    makeFakeStep(range, step, rate = null, paths) {
        let newQueen = this.game.detectQueen(step.to, range);

        if (step.hits) {
            const h = step.hits[0];
            paths[h[1]][h[0]] = '0';
        }

        if (newQueen) { 
            if (rate) { rate.isQueen = 1; }
            paths[newQueen[1]][newQueen[0]] = range === 'w' ? 'ww' : 'bb'; 
        } else {
            paths[step.to[1]][step.to[0]] = paths[step.from[1]][step.from[0]];
        }
        paths[step.from[1]][step.from[0]] = '0';
        this.game.whosTurn = this.game.transformRange(range) === 'w' ? 'b' : 'w';

        return newQueen;
    }

    rateStep(step, paths, rate, range) {
        const newQueen = this.makeFakeStep(range, step, rate, paths);
        const nextStep = this.game.setNextStep(null, paths);
        let hitsStep = this.getAllHits(nextStep, paths);
        
        if (hitsStep[0]) {
            if (this.game.whosTurn !== range) {
                rate.opponentHits += hitsStep[0].length;
            } else {
                rate.hits += hitsStep[0].length;
            }

            // hitsStep[0].forEach(h => {
            //     this.makeFakeStep(this.game.whosTurn, h, rate, paths);
            // });
            // console.log( 'hitsStep', hitsStep[0], paths )
        } else {
            // let startPossibleSteps = this.game.getPosibleSteps(paths);
            // console.log( 'startPossibleSteps', this.game.whosTurn, startPossibleSteps, paths )
        }
    }

    rateSteps() {
        const whosTurn = this.game.whosTurn, paths = ThreeCommon.copyArray(this.game.paths);
        let startPossibleSteps = this.game.getPosibleSteps(paths);
        // console.log( 'startPossibleSteps', startPossibleSteps )
        startPossibleSteps = startPossibleSteps.map((possibleStep, index) => {
            const rate = {hits: 0, opponentHits: 0, isQueen: 0},
                paths = ThreeCommon.copyArray(this.game.paths),
                range = paths[possibleStep.step.from[1]][possibleStep.step.from[0]];
            this.game.whosTurn = whosTurn;

            for (let i = 0; i < this.deep; i++) {
                this.rateStep(possibleStep.step, paths, rate, range);
            }
            possibleStep.rate = rate;

            return possibleStep;
        });
       
        return startPossibleSteps;
    }

    // rateSteps(bestStep) {
    //     const whosTurn = this.game.whosTurn, deep = 1;

    //     bestStep = bestStep.map(step => {
    //         const rate = {hits: 0, opponentHits: 0, isQueen: 0},
    //             paths = ThreeCommon.copyArray(this.game.paths);
    //         this.rateStep(step.step, 1, rate, paths);

    //         step.rate = rate;
    //         this.game.whosTurn = whosTurn;

    //         return step;
    //     })

    //     return bestStep;
    // }

    getAllHits(nextStep, p = null) {
        const paths = p ? p : this.game.paths;
        let stepsArray = [];
        this.getFakeHits(nextStep, paths, stepsArray);
        const f = new StepFormater();
        f.format(stepsArray);
       
        return f.steps;
    }

    getFakeHits(steps, _paths, stepsArray) {
        steps.forEach(step => {
            const paths = ThreeCommon.copyArray(_paths),
                _hits = this.game.checkValidStep(step.from, step.to, true, paths);
            stepsArray.push(step);

            if (_hits && _hits.length) {
                const h = _hits[0],
                    range = paths[step.from[1]][step.from[0]],
                    newQueen = this.game.detectQueen(step.to, range);
                paths[h[1]][h[0]] = 'h';

                if (newQueen) { 
                    paths[newQueen[1]][newQueen[0]] = range === 'w' ? 'ww' : 'bb'; 
                } else {
                    paths[step.to[1]][step.to[0]] = paths[step.from[1]][step.from[0]];
                }

                paths[step.from[1]][step.from[0]] = '0';
                let hits = this.game.getPosibleHits(step.to, paths);
                this.getFakeHits(hits, paths, stepsArray);
            } 
        })
    }

    getBestStep(steps) {
        let bestIndex = [], num;

        steps.forEach((step, index) => {
            if (step.rate.isQueen) {
                bestIndex.push(index);
            }
        });

        if (bestIndex.length === 0) {
            steps.forEach((step, index) => {
                if (step.rate.opponentHits === 0) {
                    bestIndex.push(index);
                }
            });
    
        }
      
        if (bestIndex.length) {
            num = bestIndex[ThreeCommon.randomInteger(0, (bestIndex.length - 1))];
        } else {
            num = ThreeCommon.randomInteger(0, (steps.length - 1));
        }
       
        return [steps[num]];
    }

    getBestHitStep(steps) {
        let best = [];
        let maxLength = 0;
        
        steps.forEach(step => {
            console.log( 'step', step )
            // if (step && step.hits && (best.length <= step.hits)) {
            if (step && step.hits) {
                if ((step.hits - step.opponentHits) >= maxLength) {
                    maxLength = (step.hits - step.opponentHits);
                }

                best.push(step);
            }
        });
       
        if (best.length === 0) {
            best = steps[ThreeCommon.randomInteger(0, steps.length - 1)].steps;
        } else if (best.length === 1) {
            best = best.map(b => b.steps);
            best = best[ThreeCommon.randomInteger(0, best.length - 1)];
        } else {
            best = best.filter(s => ((s.hits - s.opponentHits) >= maxLength));
            best = best.map(b => b.steps);
            best = best[ThreeCommon.randomInteger(0, best.length - 1)];
        }
        console.log( 'best', best )
        return best;
    }

    formatStep(steps) {
        steps = steps.map(step => {
            step = {hitChips: step.hits, step: {from: step.from, to: step.to}};
            return step;
        });

        return steps;
    }

    checkPossibleHits(steps) {
        const step = steps[0].step;
        const paths = ThreeCommon.copyArray(this.game.paths);
        paths[steps.from[1]][step.from[0]] = this.game.paths[step.to[1]][step.to[0]];
        // steps = hits.filter(h => {
        //     return this.checkValidStep(h.from, h.to, true, paths);
        // });
        return steps;
    }
}

class StepFormater {
    steps = [];

    format(steps) {
        for (let i = steps.length - 1; i >= 0; i--) {
            this.addStep(steps[i]);
        }

        this.steps = this.steps.map(_steps => _steps.reverse());
    }

    findStep(step) {
        let indexs = [];

        this.steps.forEach((_step, index) => {
            if (ThreeCommon.compareArrays(step.to, _step[_step.length - 1].from)) {
                indexs.push(index);
            }
        });

        return indexs;
    }

    addStep(step) {
        let indexs: any = this.findStep(step);

        if (indexs.length) {
            indexs.forEach(i => {
                this.steps[i].push(step);
            })
        } else {
            this.steps.push([step]);
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
            case 'classic':
                game = new Giveaway();
                game.init(currentGame);
                
                break;
        }

        return game;
    }
}