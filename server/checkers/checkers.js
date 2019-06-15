class Checkers {
    constructor(type) {
        this.type = type;
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
        this.setNextStep();
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
            ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
            ['b', '0', 'b', '0', 'b', '0', 'b', '0'],
            ['0', 'b', '0', 'b', '0', 'b', '0', 'b'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['0', '0', '0', '0', '0', '0', '0', '0'],
            ['w', '0', 'w', '0', 'w', '0', 'w', '0'],
            ['0', 'w', '0', 'w', '0', 'w', '0', 'w'],
            ['w', '0', 'w', '0', 'w', '0', 'w', '0']
        ];
        // this.paths = [
        //     ['0', '0', '0', '0', '0', '0', '0', '0'],
        //     ['0', '0', 'w', '0', 'w', '0', '0', '0'],
        //     ['0', '0', '0', '0', '0', '0', '0', '0'],
        //     ['b', '0', '0', '0', '0', '0', 'ww', '0'],
        //     ['0', 'b', '0', 'b', '0', '0', '0', '0'],
        //     ['0', '0', '0', '0', 'b', '0', 'w', '0'],
        //     ['0', 'b', '0', '0', '0', 'w', '0', 'w'],
        //     ['0', '0', '0', '0', 'w', '0', 'w', '0']
        // ];
        this.hitsChips = {
            'w': [],
            'b': []
        };
        this.whosTurn = 'w';
        this.whoWin = null;
        this.players = [];
    }

    checkTurn(userId) {
        // console.log( this.players, userId );
    }

    isCellExist(to) {
        return ((this.paths[to[1]] !== undefined) && (this.paths[to[1]][to[0]] !== undefined));
    }

    checkRange(step, userId) {
        let stepRange = this.paths[step[1]][step[0]],
            userRange;
        
        this.players.forEach(player => {
            if (player.id === userId) {
                userRange = player.range;
            }
        });

        return this.transformRange(stepRange) === this.transformRange(userRange);
    }

    checkNextStep(step) {
        if (!this.nextStep || (this.nextStep.length === 0)) { return true; }
        
        let matchesWithNextStep = false;
        this.nextStep.forEach(s => {
            if (this.compareArrays(s.from, step.from) || this.compareArrays(s.to, step.to)) {
                matchesWithNextStep = true;
            }
        });
        
        return matchesWithNextStep;
    }

    checkValidStep(from, to, isPossibleHits, paths = null) {
        const _paths = paths ? paths : this.paths;
        let canTouch = this.canTouch(from, _paths[from[1]][from[0]], isPossibleHits, _paths);
        
        if (canTouch && canTouch.length) { return; } 
        if (!this.isCellExist(to)) { return; }
        if (!this.checkDelta(from, to)) { return; }
        if (!this.isBusy(to)) { return; }
        if (!this.checkColor(to)) { return; }
        if (!this.checkDiagonal(from, to)) { return; }
        if (!isPossibleHits && !this.checkNextStep({from, to})) { return; }
        let isQueen = this.isQueen(from, paths),
            hitChips;
       
        if (isQueen) {
            hitChips = this.getHitChipsByQueen(from, to, paths);
        } else {
            hitChips = this.getHitChips(from, to, paths);

            if (!this.checkFarAndDirection(from, to, hitChips, isQueen)) { return; }
        }
       
        return hitChips;
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

    isQueen(from, paths) {
        const _paths = paths ? paths : this.paths;
        let range = _paths[from[1]][from[0]];
        
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

    getHitChipsByQueen(from, to, paths) {
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
            
            if (hitRange !== '0') { 
                hitChips.push([fromX, fromY]); 
            }
            
            if ((range === this.transformRange(hitRange)) || (hitChips.length >= 2) || (hitRange === 'h')) {
                hitChips = undefined;  
                break;
            }
        }
       
        return hitChips;
    }

    getHitChips(from, to, paths) {
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

    makeStep(step, multistep) {
        let hits = this.checkValidStep(step.from, step.to);
        
        if (hits !== undefined) {
            this.stepAction(step, hits, multistep);

            return true;
        } 
    }

    setTurn(range, step, withHit = false) {
        let hits;

        if (withHit) {
            hits = this.checkAttack(step);
        }
        console.log( hits )
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
        console.log( this.paths )
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

        this.postStepProcessor(step, multistep, withHit);
    }

    postStepProcessor(step, multistep, withHit) {
        let range = this.paths[step.to[1]][step.to[0]];

        if (!this.isQueen(step.to)) {
            this.newQueen = this.detectQueen(step.to, range);

            if (this.newQueen) { this.paths[this.newQueen[1]][this.newQueen[0]] = range === 'w' ? 'ww' : 'bb'; }
        } else if (!multistep && !this.newQueen) {
            this.newQueen = null;
        }

        this.setTurn(range, step, withHit);
        this.whoWin = this.isGameOver();
        this.setNextStep();
    }

    checkAttack(step) {
        let hits = this.getPosibleHits(step.to);

        return hits;
    }

    getLastCells(name, paths) {
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

    // getPosibleHits(name) {
    //     let possiblePaths = this.getLastCells(name),
    //         hits = [];

    //     possiblePaths.forEach(tos => {
    //         tos.forEach(to => {
    //             let h = this.checkValidStep(name, to, true);
               
    //             if (h && h.length) {
    //                 hits.push({hits: h, to, from: name});
    //             }
    //         });
    //     });
        
    //     return hits;
    // }

    // setNextStep() {
    //     this.nextStep = [];
 
    //     this.paths.forEach((row, rowIndex) => {
    //         row.forEach((chip, colIndex) => {
    //             let range = this.transformRange(chip);

    //             if (range === this.whosTurn) {
    //                 let hits = this.getPosibleHits([colIndex, rowIndex]);
                    
    //                 if (hits && hits.length) {
    //                     this.nextStep = this.nextStep.concat(hits);
    //                 }
    //             }
    //         })
    //     })
    // }

    getPosibleHits(name, paths = null) {
        let possiblePaths = this.getLastCells(name, paths),
            hits = [],
            _to = [],
            isQueen = this.isQueen(name);
       
        possiblePaths.forEach(tos => {
            tos.forEach(to => {
                let h = this.checkValidStep(name, to, true, paths);
     
                if (h && h.length) {
                    hits.push({hits: h, to, from: name});
                }
            });
        });
        hits = this.filterPosibleHits(hits, isQueen);

        return hits;
    }

    filterPosibleHits(hits, isQueen) {
        const filterHits = [];

        if (!isQueen) { return hits; }

        hits.forEach(hit => {
            if (this.getFakeHits({from: hit.from, to: hit.to})) {
                filterHits.push(hit);
            }
        });
   
        if (filterHits.length) {
            return filterHits;
        } else {
            return hits;
        }
    }

    getFakeHits(step) {
        const paths = this.copyArray(this.paths),
            h = this.checkValidStep(step.from, step.to, true, paths)[0];
        paths[step.from[1]][step.from[0]] = '0';
        paths[h[1]][h[0]] = '0';
        paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
        let hits = this.getPosibleHits(step.to, paths);
        
        return (hits.length >= 1);
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

    // isGameOver() {
    //     let whoWin;

    //     if (this.hitsChips['w'].length === 12) {
    //         whoWin = 'w';
    //     } else if (this.hitsChips['b'].length === 12) {
    //         whoWin = 'b';
    //     }

    //     return whoWin;
    // }

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
                let hitChips = this.checkValidStep(from, s, true);
                
                if (hitChips) {
                    steps.push({hitChips: [], step: {from: from, to: s}})
                }
            }
        })

        return steps;
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

    detectQueen(cellPos, range) {
        if (((cellPos[1] === 7) && (range === 'b')) || ((cellPos[1] === 0) && (range === 'w'))) {
            return cellPos;
        }
    }

    compareArrays(firstArray, secondArray) {
        if (firstArray.length !== secondArray.length) { return; }

        let flag = true;
        firstArray.forEach((i, index) => {
            if (i !== secondArray[index]) {
                flag = false;
            }
        });

        return flag;
    }

    copyArray(array) {
        let arr = [];

        array.forEach(a => {
            let type = {}.toString.call(a).slice(8, -1);

            if (type === 'Array') {
                arr.push(this.copyArray(a));
            } else if (type === 'Object') {
                arr.push(this.copyObj(a));
            } else {
                arr.push(a);
            }
        });

        return arr;
    }

    copyObj(obj) {
        let arr = {};

        for (let i in obj) {
            let type = {}.toString.call(obj[i]).slice(8, -1);
            
            if (type === 'Array') {
                arr[i] = this.copyArray(obj[i]);
            } else {
                arr[i] = obj[i];
            }
        }

        return arr;
    }

    canTouch(from, playerRange, isPossibleHits, paths) {
        const _paths = paths ? paths : this.paths;
        let validRange,
            matchesWithNextStep,
            error = [],
            range = _paths[from[1]][from[0]];
        
        if (this.nextStep && this.nextStep.length) {
            this.nextStep.forEach(step => {
                if (this.compareArrays(step.from, from)) {
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
}

module.exports = Checkers;
