(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["game-game-module"],{

/***/ "./src/app/game/animator.ts":
/*!**********************************!*\
  !*** ./src/app/game/animator.ts ***!
  \**********************************/
/*! exports provided: Animator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Animator", function() { return Animator; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

var Animator = /** @class */ (function () {
    function Animator(sound) {
        this.sound = sound;
    }
    Animator.prototype.animationMove = function (objPosition, to) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var startPos;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startPos = Object.assign({}, objPosition);
                        return [4 /*yield*/, this.move(objPosition, { x: startPos.x, y: startPos.y + 5, z: startPos.z })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.move(objPosition, { x: to.x, y: to.y + 5, z: to.z })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.move(objPosition, { x: to.x, y: to.y, z: to.z })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Animator.prototype.removeFromDesk = function (material) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fadeOut(material)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Animator.prototype.transformToQueen = function (obj) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var startY;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startY = obj.position.y;
                        return [4 /*yield*/, this.moveWithRotate(obj, { y: startY + 12 }, Math.PI)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.move(obj.position, { x: obj.position.x, y: startY + 1, z: obj.position.z }).then(function () {
                                obj.position.y = startY;
                                obj.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0));
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Animator.prototype.fadeOut = function (material) {
        var to = { val: 0 }, from = { val: material.opacity };
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(to, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                material.opacity = from.val;
            })
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.moveWithRotate = function (obj, posTo, rotation) {
        var from = { y: obj.position.y }, rotationTo = rotation, startRotation = obj.rotation.x;
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(posTo, 400)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                var pers;
                if (from.y <= posTo.y) {
                    pers = from.y / posTo.y;
                }
                else {
                    pers = posTo.y / from.y;
                }
                obj.position.y = from.y;
                obj.rotation.x = startRotation + rotation * pers;
            })
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.move = function (from, to) {
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(to, 200)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.zoomTo = function (camera, pos, toFov, zoomOut, startZoom) {
        var finishPos = { x: pos.x, y: pos.y, z: pos.z }, cameraStartX = camera.position.x, fromFov = { f: camera.fov }, startFov = camera.fov, deltaCameraX = finishPos.x - cameraStartX, lookAt = {
            delta: { x: zoomOut.x - startZoom.x, y: zoomOut.y - startZoom.y, z: zoomOut.z - startZoom.z },
            start: { x: startZoom.x, y: startZoom.y, z: startZoom.z }
        }, fovDelta = Math.abs(toFov.f - startFov);
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(fromFov)
                .to(toFov, 1100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                var pers = 1 - (Math.abs(toFov.f - fromFov.f) / fovDelta);
                camera.position.x = cameraStartX + deltaCameraX * pers;
                camera.lookAt(new THREE.Vector3(lookAt.start.x + lookAt.delta.x * pers, lookAt.start.y + lookAt.delta.y * pers, lookAt.start.z + lookAt.delta.z * pers));
                camera.fov = fromFov.f;
                camera.updateProjectionMatrix();
            })
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.soundDump = function (soundName, duration) {
        var _this = this;
        var from = { v: 1 }, to = { v: 0 };
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(to, duration)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                _this.sound.setVolume(from.v, soundName);
            })
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.lightGlitter = function (light) {
        var _this = this;
        var from = { x: 0 }, to = { x: 1000 };
        this.sound.reproduceSound('lamp');
        // this.soundDump('lamp', 3000);
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(to, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                light.intensity = _this.getRandom(0, 1.2);
                light.distance = _this.getRandomInt(0, 200);
                light.penumbra = Math.random() + 0.5;
            })
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.lightOn = function (light) {
        var from = light.position, to = { x: 0, y: 100, z: 0 };
        light.intensity = 1.2;
        light.distance = 200;
        light.penumbra = 0.5;
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(to, 1000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.rotateCamera = function (camera, cameraPos) {
        var from = camera.position, to = cameraPos, deltaY = to.y - camera.position.y, fromFov = 20, toFov = 32, deltaFov = toFov - fromFov;
        return new Promise(function (res) {
            var tween = new TWEEN.Tween(from)
                .to(to, 2500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(function () {
                var pers = 1 - (Math.abs(to.y - from.y) / deltaY);
                camera.fov = fromFov + deltaFov * pers;
                camera.updateProjectionMatrix();
                camera.lookAt(new THREE.Vector3(0.89, -15, 0));
            })
                .onComplete(function () {
                res();
            })
                .start();
        });
    };
    Animator.prototype.renderAnimation = function (camera, light, rotateCamera) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.lightGlitter(light)];
                    case 1:
                        _a.sent();
                        this.lightOn(light);
                        return [4 /*yield*/, this.rotateCamera(camera, rotateCamera)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Animator.prototype.getRandomInt = function (min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    };
    Animator.prototype.getRandom = function (min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        return rand;
    };
    Animator.prototype.degreesToRadians = function (degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180);
    };
    return Animator;
}());



/***/ }),

/***/ "./src/app/game/checkers/checkers.ts":
/*!*******************************************!*\
  !*** ./src/app/game/checkers/checkers.ts ***!
  \*******************************************/
/*! exports provided: CheckersGame, StepGenerator, Giveaway, Checkers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CheckersGame", function() { return CheckersGame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepGenerator", function() { return StepGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Giveaway", function() { return Giveaway; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Checkers", function() { return Checkers; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var src_app_game_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/game/common */ "./src/app/game/common.ts");


var CheckersGame = /** @class */ (function () {
    function CheckersGame() {
        this.hitsChips = {
            b: [],
            w: []
        };
    }
    CheckersGame.prototype.init = function (currentGame) {
        for (var i in currentGame) {
            this[i] = currentGame[i];
        }
    };
    CheckersGame.prototype.checkTurn = function (userId) {
        console.log(this.players, userId);
    };
    CheckersGame.prototype.isCellExist = function (to) {
        if (!to) {
            return;
        }
        return ((this.paths[to[1]] !== undefined) && (this.paths[to[1]][to[0]] !== undefined));
    };
    CheckersGame.prototype.checkNextStep = function (step) {
        if (!this.nextStep || (this.nextStep.length === 0)) {
            return true;
        }
        var matchesWithNextStep = false;
        this.nextStep.forEach(function (s) {
            if (src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].compareArrays(s.from, step.from) && src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].compareArrays(s.to, step.to)) {
                matchesWithNextStep = true;
            }
        });
        return matchesWithNextStep;
    };
    CheckersGame.prototype.checkValidStep = function (from, to, isPossibleHits, paths) {
        if (isPossibleHits === void 0) { isPossibleHits = false; }
        if (paths === void 0) { paths = null; }
        if (!this.isCellExist(to)) {
            return;
        }
        if (!this.checkDelta(from, to)) {
            return;
        }
        if (!this.isBusy(to)) {
            return;
        }
        if (!this.checkColor(to)) {
            return;
        }
        if (!this.checkDiagonal(from, to)) {
            return;
        }
        if (!isPossibleHits && !this.checkNextStep({ from: from, to: to })) {
            return;
        }
        var isQueen = this.isQueen(from, paths), hitChips;
        if (isQueen) {
            hitChips = this.getHitChipsByQueen(from, to, paths);
            // if (hitChips && !this.checkHits(hitChips)) { return; } // dont need becose check (hitChips.length >= 2) in getHitChipsByQueen
        }
        else {
            hitChips = this.getHitChips(from, to, paths);
            if (!this.checkFarAndDirection(from, to, hitChips, isQueen)) {
                return;
            }
        }
        return hitChips;
    };
    CheckersGame.prototype.checkHits = function (hitChips) {
        var flag = true;
        hitChips.forEach(function (hit, index) {
            if (flag && hitChips[index + 1]) {
                flag = Math.abs(hitChips[index + 1][0] - hit[0]) > 1;
            }
        });
        return flag;
    };
    CheckersGame.prototype.transformRange = function (range) {
        if (range === 'ww') {
            return 'w';
        }
        else if (range === 'bb') {
            return 'b';
        }
        else {
            return range;
        }
    };
    CheckersGame.prototype.getChip = function (position) {
        return this.paths[position[1]][position[0]];
    };
    CheckersGame.prototype.getRange = function (position) {
        var chip = this.getChip(position);
        return this.transformRange(chip);
    };
    CheckersGame.prototype.isQueen = function (from, paths) {
        if (paths === void 0) { paths = null; }
        var _paths = paths ? paths : this.paths, range = _paths[from[1]][from[0]];
        return (range === 'bb' || range === 'ww');
    };
    CheckersGame.prototype.checkDelta = function (from, to) {
        if ((from[0] === to[0]) && (from[1] === to[1])) {
            return false;
        }
        else {
            return true;
        }
    };
    CheckersGame.prototype.isBusy = function (to) {
        return this.paths[to[1]][to[0]] === '0';
    };
    CheckersGame.prototype.checkColor = function (to) {
        return this.cells[to[1]][to[0]] === 'b';
    };
    CheckersGame.prototype.checkDiagonal = function (from, to) {
        var deltaX = from[0] - to[0];
        return ((from[1] + deltaX) === to[1]) ||
            ((from[1] + Math.abs(deltaX)) === to[1]) ||
            ((from[1] - Math.abs(deltaX)) === to[1]);
    };
    CheckersGame.prototype.checkFarAndDirection = function (from, to, hitChips, isQueen) {
        var range = this.paths[from[1]][from[0]], deltaX = Math.abs(from[0] - to[0]), deltaY = from[1] - to[1];
        if ((deltaX > 2) || (Math.abs(deltaY) > 2)) {
            return;
        }
        if ((Math.abs(deltaY) === 2) && (deltaX === 2)) {
            return hitChips.length !== 0;
        }
        if (range === 'w') {
            return deltaY === 1;
        }
        else if (range === 'b') {
            return deltaY === -1;
        }
    };
    CheckersGame.prototype.getHitChipsByQueen = function (from, to, paths) {
        if (paths === void 0) { paths = null; }
        var _paths = paths ? paths : this.paths;
        var directionX = ((to[0] - from[0]) > 0) ? 1 : -1, directionY = ((to[1] - from[1]) > 0) ? 1 : -1, fromX = from[0], fromY = from[1], toX = to[0], toY = to[1], hitChips = [], range = this.transformRange(_paths[from[1]][from[0]]);
        while (fromX !== toX) {
            fromX += 1 * directionX;
            fromY += 1 * directionY;
            var hitRange = _paths[fromY][fromX];
            if (hitRange !== '0') {
                hitChips.push([fromX, fromY]);
            }
            if ((range === this.transformRange(hitRange)) || (hitChips.length >= 2) || (hitRange === 'h')) {
                hitChips = undefined;
                break;
            }
        }
        return hitChips;
    };
    CheckersGame.prototype.getHitChips = function (from, to, paths) {
        if (paths === void 0) { paths = null; }
        var _paths = paths ? paths : this.paths;
        var range = _paths[from[1]][from[0]], deltaX = to[0] - from[0], deltaY = to[1] - from[1], hitChips = [];
        if ((Math.abs(deltaY) === 2) && (Math.abs(deltaX) === 2)) {
            var hitPosX = from[0] + deltaX / 2, hitPosY = from[1] + deltaY / 2, hitRange = this.transformRange(_paths[hitPosY][hitPosX]);
            if ((range !== hitRange) && (hitRange !== '0') && (hitRange !== 'h')) {
                hitChips.push([hitPosX, hitPosY]);
            }
        }
        return hitChips;
    };
    CheckersGame.prototype.makeStep = function (step, stepsCount) {
        var hits = this.checkValidStep(step.from, step.to), multistep = !!stepsCount;
        if (hits !== undefined) {
            this.stepAction(step, hits, multistep);
        }
        return hits;
    };
    CheckersGame.prototype.getTurn = function () {
        return this.whosTurn;
    };
    CheckersGame.prototype.setTurn = function (range, step, withHit) {
        if (withHit === void 0) { withHit = false; }
        var hits;
        if (withHit) {
            hits = this.checkAttack(step);
        }
        if (!hits || (hits.length === 0)) {
            this.whosTurn = this.transformRange(range) === 'w' ? 'b' : 'w';
            this.removeHits();
        }
    };
    CheckersGame.prototype.removeHits = function () {
        this.paths = this.paths.map(function (row) {
            row = row.map(function (col) {
                if (col === 'h') {
                    col = '0';
                }
                return col;
            });
            return row;
        });
    };
    CheckersGame.prototype.stepAction = function (step, hits, multistep) {
        var _this = this;
        var userRange = this.paths[step.from[1]][step.from[0]], withHit = hits && hits.length;
        this.paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
        this.paths[step.from[1]][step.from[0]] = '0';
        if (withHit) {
            hits.forEach(function (h) {
                var range = _this.paths[h[1]][h[0]];
                _this.paths[h[1]][h[0]] = 'h';
                if (_this.transformRange(range) === 'b') {
                    _this.hitsChips.w.push(range);
                }
                else if (_this.transformRange(range) === 'w') {
                    _this.hitsChips.b.push(range);
                }
            });
        }
        this.postStepProcessor(step, userRange, withHit, multistep);
    };
    CheckersGame.prototype.postStepProcessor = function (step, userRange, withHit, multistep) {
        var range = this.paths[step.to[1]][step.to[0]];
        if (!this.isQueen(step.to)) {
            this.newQueen = this.detectQueen(step.to, range);
            if (this.newQueen) {
                this.paths[this.newQueen[1]][this.newQueen[0]] = range === 'w' ? 'ww' : 'bb';
            }
        }
        else if (!multistep && !this.newQueen) {
            this.newQueen = null;
        }
        this.setTurn(userRange, step, withHit);
        if (this.whosTurn === this.transformRange(range)) {
            this.setNextStep(step);
        }
        else {
            this.nextStep = [];
        }
        this.whoWin = this.isGameOver();
    };
    CheckersGame.prototype.checkAttack = function (step) {
        var hits = this.getPosibleHits(step.to);
        return hits;
    };
    CheckersGame.prototype.getNeighboring = function (name) {
        var _this = this;
        var possiblePaths = [
            [name[0] - 1, name[1] + 1],
            [name[0] + 1, name[1] + 1],
            [name[0] - 1, name[1] - 1],
            [name[0] + 1, name[1] - 1] //backRight
        ];
        possiblePaths = possiblePaths.map(function (p) {
            if (!_this.isCellExist(p) || !_this.isBusy(p)) {
                p = [];
            }
            return p;
        });
        if (this.isQueen(name)) {
            var steps = this.getLastCells(name);
            steps.forEach(function (step) {
                if (step.length) {
                    possiblePaths = possiblePaths.concat(step);
                }
            });
        }
        return possiblePaths;
    };
    CheckersGame.prototype.getLastCells = function (name, paths) {
        if (paths === void 0) { paths = null; }
        var possiblePaths = [[], [], [], []], i = 2;
        if (!this.isQueen(name, paths)) {
            possiblePaths = [
                [[name[0] - 2, name[1] + 2]],
                [[name[0] + 2, name[1] + 2]],
                [[name[0] - 2, name[1] - 2]],
                [[name[0] + 2, name[1] - 2]] //backRight
            ];
        }
        else {
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
    };
    CheckersGame.prototype.getPosibleHits = function (name, paths) {
        var _this = this;
        if (paths === void 0) { paths = null; }
        var possiblePaths = this.getLastCells(name, paths), hits = [], _to = [];
        possiblePaths.forEach(function (tos) {
            var flag = false;
            if (_this.isQueen(name)) {
                tos.forEach(function (to) {
                    var h = _this.checkValidStep(name, to, true, paths);
                    if (h && h.length && _this.getFakeHits({ from: name, to: to })) {
                        flag = true;
                    }
                });
            }
            tos.forEach(function (to) {
                var h = _this.checkValidStep(name, to, true, paths);
                if (h && h.length && (!flag || _this.getFakeHits({ from: name, to: to }))) {
                    hits.push({ hits: h, to: to, from: name });
                }
            });
        });
        return hits;
    };
    CheckersGame.prototype.getFakeHits = function (step) {
        var paths = src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].copyArray(this.paths), _hits = this.checkValidStep(step.from, step.to, true, paths);
        if (_hits && _hits.length) {
            var h = _hits[0];
            paths[step.from[1]][step.from[0]] = '0';
            paths[h[1]][h[0]] = 'h';
            paths[step.to[1]][step.to[0]] = this.paths[step.from[1]][step.from[0]];
            var hits = this.getPosibleHits(step.to, paths);
            return (hits.length >= 1);
        }
        else {
            return;
        }
    };
    CheckersGame.prototype.setNextStep = function (step) {
        var _this = this;
        if (step === void 0) { step = null; }
        this.nextStep = [];
        if (step) {
            var hits = this.getPosibleHits(step.to);
            if (hits && hits.length) {
                this.nextStep = this.nextStep.concat(hits);
            }
        }
        else {
            this.paths.forEach(function (row, rowIndex) {
                row.forEach(function (chip, colIndex) {
                    var range = _this.transformRange(chip);
                    if (range === _this.whosTurn) {
                        var hits = _this.getPosibleHits([colIndex, rowIndex]);
                        if (hits && hits.length) {
                            _this.nextStep = _this.nextStep.concat(hits);
                        }
                    }
                });
            });
        }
    };
    CheckersGame.prototype.isGameOver = function () {
        var whoWin;
        if (this.hitsChips['w'].length === 12) {
            whoWin = 'w';
        }
        else if (this.hitsChips['b'].length === 12) {
            whoWin = 'b';
        }
        var bestStep = this.getPosibleSteps(), hits = this.getAllPossibleHits();
        if ((bestStep.length === 0) && (hits.length === 0)) {
            whoWin = this.whosTurn === 'b' ? 'w' : 'b';
        }
        return whoWin;
    };
    CheckersGame.prototype.detectQueen = function (cellPos, range) {
        if (((cellPos[1] === 7) && (range === 'b')) || ((cellPos[1] === 0) && (range === 'w'))) {
            return cellPos;
        }
    };
    CheckersGame.prototype.canTouch = function (from, playerRange, isPossibleHits) {
        var validRange, matchesWithNextStep, error = [], range = this.paths[from[1]][from[0]];
        if (this.nextStep && this.nextStep.length) {
            this.nextStep.forEach(function (step) {
                if (src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].compareArrays(step.from, from)) {
                    matchesWithNextStep = true;
                }
            });
        }
        else {
            matchesWithNextStep = true;
        }
        if (!matchesWithNextStep && !isPossibleHits) {
            error.push(' wrong_step ');
        }
        if (this.transformRange(playerRange) !== this.transformRange(range)) {
            error.push('not_your_range');
        }
        if (this.whosTurn !== this.transformRange(range)) {
            error.push(' not_your_turn ');
        }
        return error;
    };
    CheckersGame.prototype.getPosibleSteps = function () {
        var _this = this;
        var bestStep = [];
        this.paths.forEach(function (row, rowIndex) {
            row.forEach(function (col, colIndex) {
                var range = _this.transformRange(_this.paths[rowIndex][colIndex]);
                if ((_this.paths[rowIndex][colIndex] !== 0) && (range === _this.whosTurn)) {
                    var s = _this.getPossibleStep([colIndex, rowIndex]);
                    if (s && s.length) {
                        bestStep = bestStep.concat(s);
                    }
                }
            });
        });
        return bestStep;
    };
    CheckersGame.prototype.getAllPossibleHits = function () {
        var _this = this;
        var hits = [];
        this.paths.forEach(function (row, rowIndex) {
            row.forEach(function (col, colIndex) {
                var range = _this.transformRange(_this.paths[rowIndex][colIndex]);
                if ((_this.paths[rowIndex][colIndex] !== 0) && (range === _this.whosTurn)) {
                    var hit = _this.getPosibleHits([colIndex, rowIndex]);
                    if (hit && hit.length) {
                        hits.push(hit);
                    }
                }
            });
        });
        return hits;
    };
    CheckersGame.prototype.getPossibleStep = function (from) {
        var _this = this;
        var n = this.getNeighboring(from), steps = [];
        n.forEach(function (s) {
            if (s.length) {
                var hitChips = _this.checkValidStep(from, s, true);
                if (hitChips) {
                    steps.push({ hitChips: [], step: { from: from, to: s } });
                }
            }
        });
        return steps;
    };
    return CheckersGame;
}());

var StepGenerator = /** @class */ (function () {
    function StepGenerator() {
        this.initialObj = {};
        this.game = new CheckersGame();
    }
    StepGenerator.prototype.copy = function (from, to, i) {
        if (i === void 0) { i = false; }
        for (var u in from) {
            var type = {}.toString.call(from[u]).slice(8, -1);
            switch (type) {
                case 'Array':
                    to[u] = src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].copyArray(from[u]);
                    break;
                case 'Object':
                    to[u] = src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].copyObj(from[u]);
                    break;
                case 'Function':
                    if (!i)
                        to[u] = from[u].bind(to);
                    break;
                default:
                    to[u] = from[u];
                    break;
            }
        }
    };
    StepGenerator.prototype.init = function (game) {
        this.copy(game, this.initialObj);
        this.copy(game, this.game);
    };
    StepGenerator.prototype.reset = function () {
        this.copy(this.initialObj, this.game, true);
    };
    StepGenerator.prototype.getStep = function () {
        var range = this.game.whosTurn, paths = this.game.paths, bestStep = [];
        this.game.setNextStep();
        if (this.game.nextStep.length) {
            var hitsStep = this.getAllHits();
            bestStep = this.getBestHitStep(hitsStep);
            bestStep = this.formatStep(bestStep);
        }
        else {
            bestStep = this.game.getPosibleSteps();
            bestStep = this.getBestStep(bestStep);
        }
        return { steps: bestStep, game: this.game };
    };
    StepGenerator.prototype.getAllHits = function () {
        var nextStep = this.game.nextStep.slice();
        var stepsArray = [];
        this.getFakeHits(nextStep, this.game.paths, stepsArray);
        var f = new StepFormater();
        f.format(stepsArray);
        console.log(f.steps);
        return f.steps;
    };
    StepGenerator.prototype.getFakeHits = function (steps, _paths, stepsArray) {
        var _this = this;
        steps.forEach(function (step) {
            var paths = src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].copyArray(_paths), _hits = _this.game.checkValidStep(step.from, step.to, true, paths);
            stepsArray.push(step);
            if (_hits && _hits.length) {
                var h = _hits[0], range = paths[step.from[1]][step.from[0]], newQueen = _this.game.detectQueen(step.to, range);
                paths[h[1]][h[0]] = 'h';
                if (newQueen) {
                    paths[newQueen[1]][newQueen[0]] = range === 'w' ? 'ww' : 'bb';
                }
                else {
                    paths[step.to[1]][step.to[0]] = paths[step.from[1]][step.from[0]];
                }
                paths[step.from[1]][step.from[0]] = '0';
                var hits = _this.game.getPosibleHits(step.to, paths);
                _this.getFakeHits(hits, paths, stepsArray);
            }
        });
    };
    StepGenerator.prototype.getBestStep = function (steps) {
        var num = src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].randomInteger(0, (steps.length - 1));
        return [steps[num]];
    };
    StepGenerator.prototype.getBestHitStep = function (steps) {
        var best = [];
        var maxLength = 0;
        steps.forEach(function (step) {
            if (step && step.length && (best.length <= step.length)) {
                if (step.length >= maxLength) {
                    maxLength = step.length;
                }
                best.push(step);
            }
        });
        if (best.length === 0) {
            best = steps[src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].randomInteger(0, steps.length - 1)];
        }
        else {
            best = best.filter(function (s) { return (s.length >= maxLength); });
            best = best[src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].randomInteger(0, best.length - 1)];
        }
        return best;
    };
    StepGenerator.prototype.formatStep = function (steps) {
        steps = steps.map(function (step) {
            step = { hitChips: step.hits, step: { from: step.from, to: step.to } };
            return step;
        });
        return steps;
    };
    StepGenerator.prototype.checkPossibleHits = function (steps) {
        var step = steps[0].step;
        var paths = src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].copyArray(this.game.paths);
        paths[steps.from[1]][step.from[0]] = this.game.paths[step.to[1]][step.to[0]];
        // steps = hits.filter(h => {
        //     return this.checkValidStep(h.from, h.to, true, paths);
        // });
        return steps;
    };
    return StepGenerator;
}());

var StepFormater = /** @class */ (function () {
    function StepFormater() {
        this.steps = [];
    }
    StepFormater.prototype.format = function (steps) {
        for (var i = steps.length - 1; i >= 0; i--) {
            this.addStep(steps[i]);
        }
        this.steps = this.steps.map(function (_steps) { return _steps.reverse(); });
    };
    StepFormater.prototype.findStep = function (step) {
        var indexs = [];
        this.steps.forEach(function (_step, index) {
            if (src_app_game_common__WEBPACK_IMPORTED_MODULE_1__["ThreeCommon"].compareArrays(step.to, _step[_step.length - 1].from)) {
                indexs.push(index);
            }
        });
        return indexs;
    };
    StepFormater.prototype.addStep = function (step) {
        var _this = this;
        var indexs = this.findStep(step);
        if (indexs.length) {
            indexs.forEach(function (i) {
                _this.steps[i].push(step);
            });
        }
        else {
            this.steps.push([step]);
        }
    };
    return StepFormater;
}());
var Giveaway = /** @class */ (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__["__extends"](Giveaway, _super);
    function Giveaway() {
        var _this = _super.call(this) || this;
        _this.maxHits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        return _this;
    }
    return Giveaway;
}(CheckersGame));

var Checkers = /** @class */ (function () {
    function Checkers() {
    }
    Checkers.getGame = function (currentGame) {
        var type = currentGame.type;
        var game;
        switch (type) {
            case 'giveaway':
            case 'classic':
                game = new Giveaway();
                game.init(currentGame);
                break;
        }
        return game;
    };
    return Checkers;
}());



/***/ }),

/***/ "./src/app/game/chip.ts":
/*!******************************!*\
  !*** ./src/app/game/chip.ts ***!
  \******************************/
/*! exports provided: Chip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Chip", function() { return Chip; });
var Chip = /** @class */ (function () {
    function Chip(meshLoader, range, settings) {
        var pieceMaterial = new THREE.MeshPhongMaterial({
            color: settings.chipsColors[range],
            shininess: 20,
            transparent: true
        });
        this.mesh = new THREE.Mesh(meshLoader.geom['chip'].clone());
        this.mesh.material = pieceMaterial;
        this.mesh.position.set(0, 0, 0);
        this.mesh.meshType = 'chip';
        this.mesh.renderOrder = 3;
        this.mesh.castShadow = true;
        this.range = range;
        this.settings = settings;
        // this.mesh.material.opacity = 0.1;
        if ((range === 'bb') || (range === 'ww')) {
            this.transformToQueen();
        }
    }
    Chip.prototype.getRange = function () {
        return this.range;
    };
    Chip.prototype.getName = function () {
        return this.mesh.name;
    };
    Chip.prototype.setName = function (name) {
        this.mesh.name = name;
    };
    Chip.prototype.getMesh = function () {
        return this.mesh;
    };
    Chip.prototype.moveTo = function (x, y, z) {
        this.mesh.position.set(x, y, z);
    };
    Chip.prototype.getPosition = function () {
        return this.mesh.position;
    };
    Chip.prototype.getMaterial = function () {
        return this.mesh.material;
    };
    Chip.prototype.transformToQueen = function () {
        this.mesh.rotation.x = Math.PI;
        this.mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -1, 0));
    };
    return Chip;
}());



/***/ }),

/***/ "./src/app/game/common.ts":
/*!********************************!*\
  !*** ./src/app/game/common.ts ***!
  \********************************/
/*! exports provided: ThreeCommon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ThreeCommon", function() { return ThreeCommon; });
var ThreeCommon = /** @class */ (function () {
    function ThreeCommon() {
    }
    ThreeCommon.prototype.createBoxMesh = function (size, rotation, color) {
        var bodyMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            // depthWrite: false,
            // blending: THREE.CustomBlending,
            color: color,
        });
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(size.w, size.h, size.deep), bodyMaterial);
        if (rotation) {
            if (rotation.x) {
                mesh.rotation.x = -Math.PI / 2;
            }
        }
        return mesh;
    };
    ThreeCommon.prototype.createPlaneMesh = function (size, rotation, color) {
        var bodyMaterial = new THREE.MeshPhongMaterial({
            transparent: true,
            // depthWrite: false,
            // blending: THREE.CustomBlending,
            color: color,
        });
        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(size.w, size.h), bodyMaterial);
        if (rotation) {
            if (rotation.x) {
                mesh.rotation.x = -Math.PI / 2;
            }
        }
        return mesh;
    };
    ThreeCommon.prototype.createCircleMesh = function (r, rotation, color) {
        var bodyMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true
        }), mesh = new THREE.Mesh(new THREE.CircleGeometry(r, 32), bodyMaterial);
        if (rotation) {
            if (rotation.x) {
                mesh.rotation.x = -Math.PI / 2;
            }
        }
        return mesh;
    };
    ThreeCommon.compareArrays = function (firstArray, secondArray) {
        if (firstArray.length !== secondArray.length) {
            return;
        }
        var flag = true;
        firstArray.forEach(function (i, index) {
            if (i !== secondArray[index]) {
                flag = false;
            }
        });
        return flag;
    };
    ThreeCommon.prototype.createText = function (text, font, fontSize, color) {
        var geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 3,
            height: 0.1,
        });
        var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color, transparent: true }));
        mesh.rotation.x = -Math.PI / 2;
        return mesh;
    };
    ThreeCommon.prototype.createLine = function (lines, color) {
        var material = new THREE.LineDashedMaterial({
            color: color,
            linewidth: 55
        });
        var geometry = new THREE.Geometry();
        lines.forEach(function (line) {
            geometry.vertices.push(new THREE.Vector3(line[0], line[1], line[2]));
        });
        var line = new THREE.Line(geometry, material);
        return line;
    };
    ThreeCommon.copyArray = function (array) {
        var arr = [];
        array.forEach(function (a) {
            var type = {}.toString.call(a).slice(8, -1);
            if (type === 'Array') {
                arr.push(ThreeCommon.copyArray(a));
            }
            else if (type === 'Object') {
                arr.push(ThreeCommon.copyObj(a));
            }
            else {
                arr.push(a);
            }
        });
        return arr;
    };
    ThreeCommon.copyObj = function (obj) {
        var arr = {};
        for (var i in obj) {
            var type = {}.toString.call(obj[i]).slice(8, -1);
            if (type === 'Array') {
                arr[i] = ThreeCommon.copyArray(obj[i]);
            }
            else {
                arr[i] = obj[i];
            }
        }
        return arr;
    };
    ThreeCommon.randomInteger = function (min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1);
        rand = Math.round(rand);
        return rand;
    };
    return ThreeCommon;
}());



/***/ }),

/***/ "./src/app/game/desk.ts":
/*!******************************!*\
  !*** ./src/app/game/desk.ts ***!
  \******************************/
/*! exports provided: Desk */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Desk", function() { return Desk; });
/* harmony import */ var _chip__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./chip */ "./src/app/game/chip.ts");
/* harmony import */ var src_app_game_game_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/game/game.settings */ "./src/app/game/game.settings.ts");
/* harmony import */ var src_app_game_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/game/common */ "./src/app/game/common.ts");



var Desk = /** @class */ (function () {
    function Desk(gameRenderer, meshLoader, common) {
        this.deskPos = { x: 0, y: 0 };
        this.gameSettings = new src_app_game_game_settings__WEBPACK_IMPORTED_MODULE_1__["GameSettings"];
        this.highlights = [];
        this.gameRenderer = gameRenderer;
        this.meshLoader = meshLoader;
        this.cells = [];
        this.chips = [];
        this.common = common;
    }
    Desk.prototype.create = function (cells, chips) {
        this.deskPos.x = -(cells.length / 2) * this.gameSettings.cellSize.w + this.gameSettings.cellSize.w / 2;
        this.deskPos.y = -(cells[0].length / 2) * this.gameSettings.cellSize.h + this.gameSettings.cellSize.h / 2;
        this.createCells(cells);
        this.createChips(chips);
        this.createDesk(cells.length + 1);
    };
    Desk.prototype.restart = function (chips) {
        this.clear();
        this.createChips(chips);
    };
    Desk.prototype.clear = function () {
        var _this = this;
        this.chips.forEach(function (c) {
            _this.gameRenderer.removeFromScene(c.getMesh());
        });
        this.removeHighlightCells();
        this.chips = [];
    };
    Desk.prototype.removeHighlightCells = function () {
        var _this = this;
        this.highlights.forEach(function (h) {
            _this.gameRenderer.removeFromScene(h);
        });
        this.highlights = [];
    };
    Desk.prototype.highlightCell = function (cellName, to) {
        if (to === void 0) { to = false; }
        var c = this.getCellPosition(cellName), color = '#3a873c', cell;
        if (to) {
            cell = this.common.createCircleMesh(this.gameSettings.cellSize.w / 8, { x: -Math.PI / 2 }, color);
        }
        else {
            cell = this.common.createPlaneMesh({ w: this.gameSettings.cellSize.w, h: this.gameSettings.cellSize.h }, { x: -Math.PI / 2 }, color);
        }
        cell.position.set(c.position.x, c.position.y + 0.1, c.position.z);
        this.highlights.push(cell);
        this.gameRenderer.addToScene(cell);
    };
    Desk.prototype.createChips = function (chips) {
        for (var y = 0; y < chips.length; y++) {
            for (var x = 0; x < chips[y].length; x++) {
                var range = chips[y][x];
                if (range !== '0') {
                    var chip = new _chip__WEBPACK_IMPORTED_MODULE_0__["Chip"](this.meshLoader, range, this.gameSettings);
                    this.gameRenderer.addToScene(chip.mesh);
                    chip.setName([x, y]);
                    chip.moveTo(this.deskPos.x + x * this.gameSettings.cellSize.w, 0.1, this.deskPos.y + y * this.gameSettings.cellSize.h);
                    this.chips.push(chip);
                }
            }
        }
    };
    Desk.prototype.createCells = function (cells) {
        var deskX = -this.gameSettings.deskPlayZoneSize.w / 2 + this.gameSettings.cellSize.w / 2, deskY = -this.gameSettings.deskPlayZoneSize.h / 2 + this.gameSettings.cellSize.h / 2;
        for (var x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                this.addCell(deskX + x * this.gameSettings.cellSize.w, deskY + y * this.gameSettings.cellSize.h, cells[x][y], [x, y]);
            }
        }
    };
    Desk.prototype.createDesk = function (cellsLength) {
        this.desk = this.common.createBoxMesh({ w: this.gameSettings.deskSize.w, h: this.gameSettings.deskSize.h, deep: this.gameSettings.deskSize.deep }, { x: -Math.PI / 2 }, this.gameSettings.deskColor);
        this.desk.material.map = this.meshLoader.geom['treeTexture'];
        this.desk.position.set(this.gameSettings.deskPosition.x, this.gameSettings.deskPosition.y, this.gameSettings.deskPosition.z);
        this.desk.name = 'desk';
        this.desk.receiveShadow = true;
        this.gameRenderer.addToScene(this.desk);
        this.addNumbers(cellsLength - 1);
        this.desk.material.map.wrapS = THREE.RepeatWrapping;
        this.desk.material.map.wrapT = THREE.RepeatWrapping;
        this.desk.material.map.repeat.set(0.5, 2);
        this.addBorder();
    };
    Desk.prototype.addNumbers = function (cellsLength) {
        var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (var y = 0; y < cellsLength; y++) {
            this.addNumber(0, y, (y + 1) + '', 'left');
            this.addNumber(8, y, (y + 1) + '', 'right');
            if ((y === 0) || (y === 7)) {
                for (var x = 0; x < cellsLength; x++) {
                    if (y === 0) {
                        this.addNumber(x, y, letters[x], 'top');
                    }
                    if (y === 7) {
                        this.addNumber(x, y, letters[x], 'bottom');
                    }
                }
            }
        }
    };
    Desk.prototype.addNumber = function (x, y, text, desc) {
        var deskX = -this.gameSettings.deskPlayZoneSize.w / 2, deskY = -this.gameSettings.deskPlayZoneSize.h / 2, cellSize = this.gameSettings.cellSize, fontSize = this.gameSettings.fontSize;
        var mesh = this.common.createText(text + '', this.meshLoader.geom['helvetica'], fontSize, '#382f23');
        this.gameRenderer.addToScene(mesh);
        mesh.scale.set(0.5, 0.5, 0.5);
        switch (desc) {
            case 'right':
                mesh.position.set(deskX + x * cellSize.w + fontSize / 5.5, 0, deskY + y * cellSize.h + cellSize.h / 2);
                break;
            case 'left':
                mesh.position.set(deskX + x * cellSize.w - fontSize / 3, 0, deskY + y * cellSize.h + cellSize.h / 2);
                break;
            case 'bottom':
                mesh.position.set(deskX + x * cellSize.w + cellSize.w / 2 - fontSize / 15, 0, deskY + y * cellSize.h + cellSize.h + fontSize / 3);
                break;
            case 'top':
                mesh.position.set(deskX + x * cellSize.w + cellSize.w / 2 - fontSize / 15, 0, deskY + y * cellSize.h - fontSize / 5.5);
                break;
        }
    };
    Desk.prototype.addBorder = function () {
        var deskXL = -this.gameSettings.deskPlayZoneSize.w / 2, deskXR = this.gameSettings.deskPlayZoneSize.w / 2, deskTY = -this.gameSettings.deskPlayZoneSize.h / 2, deskTB = this.gameSettings.deskPlayZoneSize.h / 2, line = this.common.createLine([
            [deskXL, 0.15, deskTY],
            [deskXR, 0.15, deskTY],
            [deskXR, 0.15, deskTB],
            [deskXL, 0.15, deskTB],
            [deskXL, 0.15, deskTY]
        ], this.gameSettings.cellsColors['b']);
        this.gameRenderer.addToScene(line);
    };
    Desk.prototype.getDeskMesh = function () {
        return this.desk;
    };
    Desk.prototype.addCell = function (x, y, colorName, name) {
        var cell = this.common.createPlaneMesh({ w: this.gameSettings.cellSize.w, h: this.gameSettings.cellSize.h }, { x: -Math.PI / 2 }, this.gameSettings.cellsColors[colorName]);
        if (colorName === 'b') {
            cell.material.opacity = 0.7;
        }
        else {
            cell.material.opacity = 0.4;
        }
        cell.position.set(x, 0.15, y);
        cell.name = name;
        cell.renderOrder = 2; //fix blend bug
        cell.receiveShadow = true;
        cell.meshType = 'cell';
        this.cells.push(cell);
        this.gameRenderer.addToScene(cell);
    };
    Desk.prototype.getCellPosition = function (nameCell) {
        var cell;
        this.cells.forEach(function (c) {
            if (src_app_game_common__WEBPACK_IMPORTED_MODULE_2__["ThreeCommon"].compareArrays(nameCell, c.name)) {
                cell = c;
            }
        });
        return cell;
    };
    Desk.prototype.getChip = function (chipName) {
        var chip;
        this.chips.forEach(function (c) {
            if (src_app_game_common__WEBPACK_IMPORTED_MODULE_2__["ThreeCommon"].compareArrays(chipName, c.getName())) {
                chip = c;
            }
        });
        return chip;
    };
    return Desk;
}());



/***/ }),

/***/ "./src/app/game/drag-and-drop.ts":
/*!***************************************!*\
  !*** ./src/app/game/drag-and-drop.ts ***!
  \***************************************/
/*! exports provided: DragAndDrop */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DragAndDrop", function() { return DragAndDrop; });
var DragAndDrop = /** @class */ (function () {
    function DragAndDrop(renderer, desk) {
        this.raycaster = new THREE.Raycaster();
        this.renderer = renderer.getRenderer();
        this.camera = renderer.getCamera();
        this.scene = renderer.getScene();
        this.desk = desk;
    }
    DragAndDrop.prototype.setMousePosition = function (event) {
        this.x = ((event.clientX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width) * 2 * this.renderer.getPixelRatio() - 1;
        this.y = -((event.clientY - this.renderer.domElement.offsetTop) / this.renderer.domElement.height) * 2 * this.renderer.getPixelRatio() + 1;
    };
    DragAndDrop.prototype.getIntersects = function (event) {
        this.setMousePosition(event);
        this.raycaster.setFromCamera({ x: this.x, y: this.y }, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        return intersects;
    };
    DragAndDrop.prototype.getRegardingPosition = function (obj) {
        var vector = new THREE.Vector3(this.x, this.y, 1);
        vector.unproject(this.camera);
        this.raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());
        return this.raycaster.intersectObject(obj);
    };
    DragAndDrop.prototype.start = function (obj, onDrop) {
        var th = this;
        window.addEventListener('mousemove', drug);
        document.addEventListener('mouseup', drop);
        function drug(e) {
            th.setMousePosition(e);
            var i = th.getRegardingPosition(th.desk);
            if (i[0]) {
                obj.position.set(i[0].point.x, i[0].point.y + 1, i[0].point.z - 0.5);
            }
            e.preventDefault();
        }
        function drop(event) {
            if (onDrop) {
                var intersects = th.getIntersects(event);
                var cellName = void 0;
                for (var item in intersects) {
                    if (intersects[item].object.meshType === 'cell') {
                        cellName = intersects[item].object.name;
                    }
                }
                onDrop(cellName);
            }
            window.removeEventListener('mousemove', drug);
            document.removeEventListener('mouseup', drop);
        }
    };
    return DragAndDrop;
}());



/***/ }),

/***/ "./src/app/game/game-interface/game-interface.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/game/game-interface/game-interface.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"players\" *ngIf=\"data\">\n    <div class=\"player\" [ngClass]=\"{\n            player_black: player.range === 'b', \n            player_white: player.range === 'w', \n            turn: player.turn\n        }\" *ngFor=\"let player of data\">\n        <div class=\"player__col player__col_range\">\n            <div class=\"player__range\" [ngClass]=\"{w: player.range === 'w', b: player.range === 'b'}\"></div>\n        </div>\n        <h5 class=\"player__col player__score\">{{player.score.score}}</h5>\n        <div class=\"player__col player__hits\">{{player.hitsChips.length}}</div>\n        <h5 class=\"player__col player__name\">{{player.score.name}}</h5>\n    </div>\n</div>\n<div class=\"menu\">\n    <button (click)=\"warnOpen('newGame')\" title=\"new game\" class=\"material-icons btn\">autorenew</button>\n    <a routerLink=\"/\" title=\"go to list\" class=\"material-icons btn\">list</a>\n    <button (click)=\"soundSwitch()\" title=\"sound off\" class=\"material-icons btn\">{{(soundState === 'on' ? 'volume_up' : 'volume_off')}}</button>\n</div>\n<div class=\"warn\" [ngClass]=\"{'show': isWarnOpen}\">\n    <div class=\"warn__message\">\n        <h5 class=\"warn__title\">{{warnMessage}}</h5>\n        <div class=\"flex\">\n            <button (click)=\"confirmation('yes')\" class=\"btn\">yes</button>\n            <button (click)=\"confirmation('no')\" class=\"btn\">no</button>\n        </div>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/game/game-interface/game-interface.component.scss":
/*!*******************************************************************!*\
  !*** ./src/app/game/game-interface/game-interface.component.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  opacity: 0;\n  transition: opacity .5s; }\n  :host.show {\n    opacity: 1; }\n  .players {\n  position: absolute;\n  bottom: 0;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n          transform: translateX(-50%);\n  display: flex;\n  background: rgba(255, 255, 255, 0.25);\n  border-radius: .5rem;\n  padding: 0 3rem;\n  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.8); }\n  .player {\n  padding: .25rem 0;\n  display: flex;\n  align-items: center;\n  height: 3.2rem;\n  color: #fff; }\n  .player__col {\n    padding: .4rem 1.25rem; }\n  .player__col_range {\n      padding: .4rem .25rem; }\n  .player__name {\n    font: 1rem Arial;\n    width: 8rem;\n    text-transform: uppercase;\n    text-align: right;\n    padding: 0 .25rem; }\n  .player__hits {\n    overflow: hidden;\n    display: flex;\n    flex-wrap: wrap;\n    align-items: flex-start;\n    justify-content: flex-start;\n    background: #83232f;\n    border-radius: .25rem; }\n  .player.turn:after {\n    content: '';\n    position: absolute;\n    left: 1rem;\n    top: 50%;\n    -webkit-transform: translateY(-50%);\n            transform: translateY(-50%);\n    border-bottom: 1rem solid transparent;\n    border-top: 1rem solid transparent;\n    border-left: 1.5rem solid #83232f; }\n  .player.turn.player_black:after {\n    left: initial;\n    right: 1rem;\n    border-bottom: 1rem solid transparent;\n    border-top: 1rem solid transparent;\n    border-right: 1.5rem solid #83232f;\n    border-left: none; }\n  .player__score, .player__hits {\n    font: 1.2rem Arial; }\n  .player__score, .player__name {\n    color: #fff; }\n  .player_white .player__name {\n    order: 1;\n    text-align: left; }\n  .player_white .player__score {\n    order: 3; }\n  .player_white .player__hits {\n    order: 2; }\n  .player_white .player__col_range {\n    order: 4; }\n  .player__hit {\n    width: 1.3rem;\n    height: 1.3rem;\n    border-radius: 50%;\n    margin: .11rem; }\n  .player__hit_w {\n      background: #fff; }\n  .player__hit_b {\n      background: #000; }\n  .player__range {\n    width: 2.2rem;\n    height: 2.2rem;\n    border-radius: 50%;\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); }\n  .player__range.w {\n      background: #fff; }\n  .player__range.b {\n      background: #000; }\n  .menu {\n  position: absolute;\n  top: 50%;\n  left: 1%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%); }\n  .menu .btn {\n    font-size: 3rem;\n    margin: .5rem;\n    display: block; }\n  .warn {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0.7);\n  z-index: 10;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity .5s; }\n  .warn .flex {\n    justify-content: center; }\n  .warn.show {\n    opacity: 1;\n    pointer-events: all; }\n  .warn__message {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%);\n    padding: 2vmin; }\n  .warn__title {\n    text-align: center;\n    text-transform: uppercase;\n    color: #fff;\n    font: 1.5rem Arial;\n    margin-bottom: 1rem; }\n  .warn .btn {\n    margin: 2vmin;\n    padding: 3vmin 5vmin;\n    font: 1.5rem Arial; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pbGEvRG9jdW1lbnRzL3Byb2dyYW0vYW5nL2NoZWNrZXJzL25ldy9jbGllbnQvc3JjL2FwcC9nYW1lL2dhbWUtaW50ZXJmYWNlL2dhbWUtaW50ZXJmYWNlLmNvbXBvbmVudC5zY3NzIiwiL1VzZXJzL2lsYS9Eb2N1bWVudHMvcHJvZ3JhbS9hbmcvY2hlY2tlcnMvbmV3L2NsaWVudC9zcmMvc2Nzcy9fdmFycy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksbUJBQWtCO0VBQ2xCLE9BQU07RUFDTixRQUFPO0VBQ1AsU0FBUTtFQUNSLFVBQVM7RUFDVCxXQUFVO0VBQ1Ysd0JBQXVCLEVBSzFCO0VBWkQ7SUFVUSxXQUFVLEVBQ2I7RUFHTDtFQUNJLG1CQUFrQjtFQUNsQixVQUFTO0VBQ1QsVUFBUztFQUNULG9DQUEyQjtVQUEzQiw0QkFBMkI7RUFDM0IsY0FBYTtFQUNiLHNDQUFvQztFQUNwQyxxQkFBb0I7RUFDcEIsZ0JBQWU7RUFDZiw4Q0FBNEMsRUFDL0M7RUFFRDtFQUNJLGtCQUFpQjtFQUNqQixjQUFhO0VBQ2Isb0JBQW1CO0VBQ25CLGVBQWM7RUFDZCxZQUFXLEVBOEdkO0VBNUdHO0lBQ0ksdUJBQXNCLEVBS3pCO0VBSEc7TUFDSSxzQkFBcUIsRUFDeEI7RUFHTDtJQUNJLGlCQzVDUTtJRDZDUixZQUFXO0lBQ1gsMEJBQXlCO0lBQ3pCLGtCQUFpQjtJQUNqQixrQkFBaUIsRUFDcEI7RUFFRDtJQUNJLGlCQUFnQjtJQUNoQixjQUFhO0lBQ2IsZ0JBQWU7SUFDZix3QkFBdUI7SUFDdkIsNEJBQTJCO0lBQzNCLG9CQUFtQjtJQUNuQixzQkFBcUIsRUFDeEI7RUEvQkw7SUFtQ1ksWUFBVztJQUNYLG1CQUFrQjtJQUNsQixXQUFVO0lBQ1YsU0FBUTtJQUNSLG9DQUEyQjtZQUEzQiw0QkFBMkI7SUFDM0Isc0NBQXFDO0lBQ3JDLG1DQUFrQztJQUNsQyxrQ0FBaUMsRUFDcEM7RUEzQ1Q7SUFnRFksY0FBYTtJQUNiLFlBQVc7SUFDWCxzQ0FBcUM7SUFDckMsbUNBQWtDO0lBQ2xDLG1DQUFrQztJQUNsQyxrQkFBaUIsRUFDcEI7RUFHTDtJQUVJLG1CQ3ZGUSxFRHdGWDtFQUVEO0lBRUksWUFBVyxFQUNkO0VBRUE7SUFFTyxTQUFRO0lBQ1IsaUJBQWdCLEVBQ25CO0VBSko7SUFPTyxTQUFRLEVBQ1g7RUFSSjtJQVdPLFNBQVEsRUFDWDtFQVpKO0lBZU8sU0FBUSxFQUNYO0VBR0w7SUFDSSxjQUFhO0lBQ2IsZUFBYztJQUNkLG1CQUFrQjtJQUNsQixlQUFjLEVBU2pCO0VBUEc7TUFDSSxpQkFBZ0IsRUFDbkI7RUFFRDtNQUNJLGlCQUFnQixFQUNuQjtFQUdMO0lBQ0ksY0FBYTtJQUNiLGVBQWM7SUFDZCxtQkFBa0I7SUFDbEIsd0NBQXNDLEVBU3pDO0VBYkE7TUFPTyxpQkFBZ0IsRUFDbkI7RUFSSjtNQVdPLGlCQUFnQixFQUNuQjtFQUlUO0VBQ0ksbUJBQWtCO0VBQ2xCLFNBQVE7RUFDUixTQUFRO0VBQ1Isb0NBQTJCO1VBQTNCLDRCQUEyQixFQU85QjtFQVhEO0lBT1EsZ0JBQWU7SUFDZixjQUFhO0lBQ2IsZUFBYyxFQUNqQjtFQUdMO0VBQ0ksbUJBQWtCO0VBQ2xCLE9BQU07RUFDTixRQUFPO0VBQ1AsU0FBUTtFQUNSLFVBQVM7RUFDVCwrQkFBNkI7RUFDN0IsWUFBVztFQUNYLFdBQVU7RUFDVixxQkFBb0I7RUFDcEIsd0JBQXVCLEVBZ0MxQjtFQTFDRDtJQWFRLHdCQUF1QixFQUMxQjtFQWRMO0lBaUJRLFdBQVU7SUFDVixvQkFBbUIsRUFDdEI7RUFFRDtJQUNJLG1CQUFrQjtJQUNsQixTQUFRO0lBQ1IsVUFBUztJQUNULHlDQUFnQztZQUFoQyxpQ0FBZ0M7SUFDaEMsZUFBYyxFQUNqQjtFQUVEO0lBQ0ksbUJBQWtCO0lBQ2xCLDBCQUF5QjtJQUN6QixZQUFXO0lBQ1gsbUJDL0xRO0lEZ01SLG9CQUFtQixFQUN0QjtFQW5DTDtJQXNDUSxjQUFhO0lBQ2IscUJBQW9CO0lBQ3BCLG1CQ3RNUSxFRHVNWCIsImZpbGUiOiJzcmMvYXBwL2dhbWUvZ2FtZS1pbnRlcmZhY2UvZ2FtZS1pbnRlcmZhY2UuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0ICd2YXJzJztcblxuOmhvc3Qge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICByaWdodDogMDtcbiAgICBib3R0b206IDA7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC41cztcblxuICAgICYuc2hvdyB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxufVxuXG4ucGxheWVycyB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGJvdHRvbTogMDtcbiAgICBsZWZ0OiA1MCU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAuMjUpO1xuICAgIGJvcmRlci1yYWRpdXM6IC41cmVtO1xuICAgIHBhZGRpbmc6IDAgM3JlbTtcbiAgICBib3gtc2hhZG93OiBpbnNldCAwIDAgMTBweCByZ2JhKDAsIDAsIDAsIC44KTtcbn1cblxuLnBsYXllciB7XG4gICAgcGFkZGluZzogLjI1cmVtIDA7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGhlaWdodDogMy4ycmVtO1xuICAgIGNvbG9yOiAjZmZmO1xuXG4gICAgJl9fY29sIHtcbiAgICAgICAgcGFkZGluZzogLjRyZW0gMS4yNXJlbTtcblxuICAgICAgICAmX3JhbmdlIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IC40cmVtIC4yNXJlbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX25hbWUge1xuICAgICAgICBmb250OiAxcmVtICRtYWluRm9udDtcbiAgICAgICAgd2lkdGg6IDhyZW07XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICBwYWRkaW5nOiAwIC4yNXJlbTtcbiAgICB9XG5cbiAgICAmX19oaXRzIHtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBiYWNrZ3JvdW5kOiAjODMyMzJmO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAuMjVyZW07XG4gICAgfVxuXG4gICAgJi50dXJuIHtcbiAgICAgICAgJjphZnRlciB7XG4gICAgICAgICAgICBjb250ZW50OiAnJztcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIGxlZnQ6IDFyZW07XG4gICAgICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFyZW0gc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAxcmVtIHNvbGlkIHRyYW5zcGFyZW50O1xuICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IDEuNXJlbSBzb2xpZCAjODMyMzJmO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi50dXJuLnBsYXllcl9ibGFjayB7XG4gICAgICAgICY6YWZ0ZXIge1xuICAgICAgICAgICAgbGVmdDogaW5pdGlhbDtcbiAgICAgICAgICAgIHJpZ2h0OiAxcmVtO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXJlbSBzb2xpZCB0cmFuc3BhcmVudDtcbiAgICAgICAgICAgIGJvcmRlci10b3A6IDFyZW0gc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgICAgICAgICBib3JkZXItcmlnaHQ6IDEuNXJlbSBzb2xpZCAjODMyMzJmO1xuICAgICAgICAgICAgYm9yZGVyLWxlZnQ6IG5vbmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19zY29yZSxcbiAgICAmX19oaXRzIHtcbiAgICAgICAgZm9udDogMS4ycmVtICRtYWluRm9udDtcbiAgICB9XG5cbiAgICAmX19zY29yZSxcbiAgICAmX19uYW1lIHtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgfVxuXG4gICAgJl93aGl0ZSB7XG4gICAgICAgIC5wbGF5ZXJfX25hbWUge1xuICAgICAgICAgICAgb3JkZXI6IDE7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICB9XG5cbiAgICAgICAgLnBsYXllcl9fc2NvcmUge1xuICAgICAgICAgICAgb3JkZXI6IDM7XG4gICAgICAgIH1cblxuICAgICAgICAucGxheWVyX19oaXRzIHtcbiAgICAgICAgICAgIG9yZGVyOiAyO1xuICAgICAgICB9XG5cbiAgICAgICAgLnBsYXllcl9fY29sX3JhbmdlIHtcbiAgICAgICAgICAgIG9yZGVyOiA0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faGl0IHtcbiAgICAgICAgd2lkdGg6IDEuM3JlbTtcbiAgICAgICAgaGVpZ2h0OiAxLjNyZW07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgbWFyZ2luOiAuMTFyZW07XG5cbiAgICAgICAgJl93IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIH1cblxuICAgICAgICAmX2Ige1xuICAgICAgICAgICAgYmFja2dyb3VuZDogIzAwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3JhbmdlIHtcbiAgICAgICAgd2lkdGg6IDIuMnJlbTtcbiAgICAgICAgaGVpZ2h0OiAyLjJyZW07XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgYm94LXNoYWRvdzogMCAwIDEwcHggcmdiYSgwLCAwLCAwLCAuNSk7XG4gICAgICAgIFxuICAgICAgICAmLncge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgICAgfVxuXG4gICAgICAgICYuYiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMDAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4ubWVudSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogNTAlO1xuICAgIGxlZnQ6IDElO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcblxuICAgIC5idG4ge1xuICAgICAgICBmb250LXNpemU6IDNyZW07XG4gICAgICAgIG1hcmdpbjogLjVyZW07XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cbn1cblxuLndhcm4ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICByaWdodDogMDtcbiAgICBib3R0b206IDA7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAuNyk7XG4gICAgei1pbmRleDogMTA7XG4gICAgb3BhY2l0eTogMDtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IC41cztcblxuICAgIC5mbGV4IHtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJi5zaG93IHtcbiAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IGFsbDtcbiAgICB9XG5cbiAgICAmX19tZXNzYWdlIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDUwJTtcbiAgICAgICAgbGVmdDogNTAlO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgICAgICAgcGFkZGluZzogMnZtaW47XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICBmb250OiAxLjVyZW0gJG1haW5Gb250O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAgIH1cblxuICAgIC5idG4ge1xuICAgICAgICBtYXJnaW46IDJ2bWluO1xuICAgICAgICBwYWRkaW5nOiAzdm1pbiA1dm1pbjtcbiAgICAgICAgZm9udDogMS41cmVtICRtYWluRm9udDtcbiAgICB9XG59IiwiJG1haW5Gb250OiBBcmlhbDtcbiRtYWluQ29sb3I6ICM1NzJkMTU7Il19 */"

/***/ }),

/***/ "./src/app/game/game-interface/game-interface.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/game/game-interface/game-interface.component.ts ***!
  \*****************************************************************/
/*! exports provided: GameInterfaceComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameInterfaceComponent", function() { return GameInterfaceComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var GameInterfaceComponent = /** @class */ (function () {
    function GameInterfaceComponent() {
        this.isWarnOpen = false;
        this.warnMessage = '';
        this.state = '';
        this.newGame = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.onSoundSwitch = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
    }
    GameInterfaceComponent.prototype.ngOnChanges = function () {
        // console.log( 'GameInterfaceComponent', this.data );
    };
    GameInterfaceComponent.prototype.warnOpen = function (event) {
        this.isWarnOpen = true;
        switch (event) {
            case 'newGame':
                this.state = 'waitForNewGame';
                this.warnMessage = 'do you want to give up, and start new game?';
                break;
        }
    };
    GameInterfaceComponent.prototype.confirmation = function (flag) {
        switch (this.state) {
            case 'waitForNewGame':
                if (flag === 'yes') {
                    this.newGame.emit();
                }
                break;
        }
        this.isWarnOpen = false;
        this.state = 'idle';
    };
    GameInterfaceComponent.prototype.soundSwitch = function () {
        this.onSoundSwitch.emit();
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameInterfaceComponent.prototype, "data", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameInterfaceComponent.prototype, "soundState", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameInterfaceComponent.prototype, "newGame", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameInterfaceComponent.prototype, "onSoundSwitch", void 0);
    GameInterfaceComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'game-interface',
            template: __webpack_require__(/*! ./game-interface.component.html */ "./src/app/game/game-interface/game-interface.component.html"),
            styles: [__webpack_require__(/*! ./game-interface.component.scss */ "./src/app/game/game-interface/game-interface.component.scss")]
        })
    ], GameInterfaceComponent);
    return GameInterfaceComponent;
}());



/***/ }),

/***/ "./src/app/game/game-over/game-over.component.html":
/*!*********************************************************!*\
  !*** ./src/app/game/game-over/game-over.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"wrap\">\n    <ng-container *ngIf=\"!meetingFinish\">\n        <div *ngIf=\"result\" class=\"win\">\n            <h5 class=\"win__title\">YOU WIN</h5>   \n        </div>\n        <div *ngIf=\"!result\" class=\"loose\">\n            <h5 class=\"win__title\">YOU LOOSE</h5>   \n        </div>\n    </ng-container>\n    <ng-container *ngIf=\"meetingFinish\">\n        <div class=\"win\">\n            <h5 class=\"win__title\">the meeting is over</h5>   \n        </div>\n    </ng-container>\n    <div class=\"content\">\n        <ng-content></ng-content>\n    </div>\n</div>"

/***/ }),

/***/ "./src/app/game/game-over/game-over.component.scss":
/*!*********************************************************!*\
  !*** ./src/app/game/game-over/game-over.component.scss ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ":host {\n  position: absolute;\n  z-index: 11;\n  bottom: 0;\n  top: 0;\n  left: 0;\n  right: 0;\n  background: rgba(0, 0, 0, 0.6); }\n\n.wrap {\n  padding: 3rem;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  background: #fff; }\n\n.win__title {\n  font: 2rem verdana;\n  color: #000;\n  text-align: center; }\n\n.content {\n  margin-top: 3vmin;\n  display: flex;\n  align-items: center;\n  justify-content: center; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pbGEvRG9jdW1lbnRzL3Byb2dyYW0vYW5nL2NoZWNrZXJzL25ldy9jbGllbnQvc3JjL2FwcC9nYW1lL2dhbWUtb3Zlci9nYW1lLW92ZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxtQkFBa0I7RUFDbEIsWUFBVztFQUNYLFVBQVM7RUFDVCxPQUFNO0VBQ04sUUFBTztFQUNQLFNBQVE7RUFDUiwrQkFBNkIsRUFDaEM7O0FBRUQ7RUFDSSxjQUFhO0VBQ2IsbUJBQWtCO0VBQ2xCLFNBQVE7RUFDUixVQUFTO0VBQ1QseUNBQWdDO1VBQWhDLGlDQUFnQztFQUNoQyxpQkFBZ0IsRUFDbkI7O0FBRUQ7RUFDSSxtQkFBa0I7RUFDbEIsWUFBVztFQUNYLG1CQUFrQixFQUNyQjs7QUFFRDtFQUNJLGtCQUFpQjtFQUNqQixjQUFhO0VBQ2Isb0JBQW1CO0VBQ25CLHdCQUF1QixFQUMxQiIsImZpbGUiOiJzcmMvYXBwL2dhbWUvZ2FtZS1vdmVyL2dhbWUtb3Zlci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIjpob3N0IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgei1pbmRleDogMTE7XG4gICAgYm90dG9tOiAwO1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIHJpZ2h0OiAwO1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjYpO1xufVxuXG4ud3JhcCB7XG4gICAgcGFkZGluZzogM3JlbTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1MCU7XG4gICAgbGVmdDogNTAlO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuICAgIGJhY2tncm91bmQ6ICNmZmY7XG59XG5cbi53aW5fX3RpdGxlIHtcbiAgICBmb250OiAycmVtIHZlcmRhbmE7XG4gICAgY29sb3I6ICMwMDA7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uY29udGVudCB7XG4gICAgbWFyZ2luLXRvcDogM3ZtaW47XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/game/game-over/game-over.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/game/game-over/game-over.component.ts ***!
  \*******************************************************/
/*! exports provided: GameOverComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameOverComponent", function() { return GameOverComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var GameOverComponent = /** @class */ (function () {
    function GameOverComponent() {
    }
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameOverComponent.prototype, "result", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameOverComponent.prototype, "meetingFinish", void 0);
    GameOverComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'game-over',
            template: __webpack_require__(/*! ./game-over.component.html */ "./src/app/game/game-over/game-over.component.html"),
            styles: [__webpack_require__(/*! ./game-over.component.scss */ "./src/app/game/game-over/game-over.component.scss")]
        })
    ], GameOverComponent);
    return GameOverComponent;
}());



/***/ }),

/***/ "./src/app/game/game-view.component.html":
/*!***********************************************!*\
  !*** ./src/app/game/game-view.component.html ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div #container id=\"container\"></div>\n<div *ngIf=\"isGameOver\" class=\"gameOver\">\n        {{isMeetingFinish}}\n    <game-over [meetingFinish]=\"isMeetingFinish\" [result]=\"isGameOver === range\">\n        <ng-container *ngIf=\"!isMeetingFinish\">\n            <button *ngIf=\"!isBot\" (click)=\"createNewGame()\" class=\"btn btn_md btn_default\">new game</button>\n        </ng-container>\n        <button (click)=\"onLeaveGame()\" class=\"btn btn_md btn_default\">game list</button>\n    </game-over>\n</div>\n<div class=\"splash\" *ngIf=\"viewState === 'splash'\">\n    <div class=\"splash-window\">\n        <h5 class=\"splash-window__title\">Enable full-screen mode</h5>\n        <div class=\"splash-window__btns\">\n            <button (click)=\"fullScreenToggle(true)\" class=\"btn btn_md btn_white splash-window__btn\">yes</button>\n            <button (click)=\"fullScreenToggle(false)\" class=\"btn btn_md btn_white splash-window__btn\">no</button>\n        </div>\n    </div>\n</div>\n"

/***/ }),

/***/ "./src/app/game/game-view.component.scss":
/*!***********************************************!*\
  !*** ./src/app/game/game-view.component.scss ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".splash {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 10; }\n  .splash-window {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%);\n    padding: 5rem; }\n  .splash-window__title {\n      color: #fff;\n      font: 1.5rem Arial;\n      text-align: center; }\n  .splash-window__btns {\n      display: flex;\n      justify-content: center;\n      margin-top: 1rem; }\n  .splash-window__btn {\n      color: #fff;\n      font: 1rem Arial;\n      margin: .5rem; }\n  .gameOver .btn {\n  margin: 1vmin; }\n  .interface {\n  position: absolute;\n  top: 50%;\n  left: 2%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9pbGEvRG9jdW1lbnRzL3Byb2dyYW0vYW5nL2NoZWNrZXJzL25ldy9jbGllbnQvc3JjL2FwcC9nYW1lL2dhbWUtdmlldy5jb21wb25lbnQuc2NzcyIsIi9Vc2Vycy9pbGEvRG9jdW1lbnRzL3Byb2dyYW0vYW5nL2NoZWNrZXJzL25ldy9jbGllbnQvc3JjL3Njc3MvX3ZhcnMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLG1CQUFrQjtFQUNsQixPQUFNO0VBQ04sUUFBTztFQUNQLFNBQVE7RUFDUixVQUFTO0VBQ1QsWUFBVyxFQTRCZDtFQTFCRztJQUNJLG1CQUFrQjtJQUNsQixTQUFRO0lBQ1IsVUFBUztJQUNULHlDQUFnQztZQUFoQyxpQ0FBZ0M7SUFDaEMsY0FBYSxFQW9CaEI7RUFqQkc7TUFDSSxZQUFXO01BQ1gsbUJDcEJJO01EcUJKLG1CQUFrQixFQUNyQjtFQUVEO01BQ0ksY0FBYTtNQUNiLHdCQUF1QjtNQUN2QixpQkFBZ0IsRUFDbkI7RUFFRDtNQUNJLFlBQVc7TUFDWCxpQkNoQ0k7TURpQ0osY0FBYSxFQUNoQjtFQUlUO0VBRVEsY0FBYSxFQUNoQjtFQUdMO0VBQ0ksbUJBQWtCO0VBQ2xCLFNBQVE7RUFDUixTQUFRO0VBQ1Isb0NBQTJCO1VBQTNCLDRCQUEyQixFQUM5QiIsImZpbGUiOiJzcmMvYXBwL2dhbWUvZ2FtZS12aWV3LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCAndmFycyc7XG5cbi5zcGxhc2gge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICByaWdodDogMDtcbiAgICBib3R0b206IDA7XG4gICAgei1pbmRleDogMTA7XG5cbiAgICAmLXdpbmRvdyB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgIHBhZGRpbmc6IDVyZW07XG4gICAgICAgIC8vIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgLjcpO1xuXG4gICAgICAgICZfX3RpdGxlIHtcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICAgICAgZm9udDogMS41cmVtICRtYWluRm9udDtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2J0bnMge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMXJlbTtcbiAgICAgICAgfVxuICAgIFxuICAgICAgICAmX19idG4ge1xuICAgICAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgICAgICBmb250OiAxcmVtICRtYWluRm9udDtcbiAgICAgICAgICAgIG1hcmdpbjogLjVyZW07XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi5nYW1lT3ZlciB7XG4gICAgLmJ0biB7XG4gICAgICAgIG1hcmdpbjogMXZtaW47XG4gICAgfVxufVxuXG4uaW50ZXJmYWNlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1MCU7XG4gICAgbGVmdDogMiU7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xufSIsIiRtYWluRm9udDogQXJpYWw7XG4kbWFpbkNvbG9yOiAjNTcyZDE1OyJdfQ== */"

/***/ }),

/***/ "./src/app/game/game-view.component.ts":
/*!*********************************************!*\
  !*** ./src/app/game/game-view.component.ts ***!
  \*********************************************/
/*! exports provided: GameViewComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameViewComponent", function() { return GameViewComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _renderer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./renderer */ "./src/app/game/renderer.ts");
/* harmony import */ var _desk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./desk */ "./src/app/game/desk.ts");
/* harmony import */ var _drag_and_drop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./drag-and-drop */ "./src/app/game/drag-and-drop.ts");
/* harmony import */ var _animator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./animator */ "./src/app/game/animator.ts");
/* harmony import */ var src_app_services_sound_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/sound.service */ "./src/app/services/sound.service.ts");
/* harmony import */ var src_app_game_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/game/common */ "./src/app/game/common.ts");
/* harmony import */ var src_app_services_mesh_loader_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/services/mesh-loader.service */ "./src/app/services/mesh-loader.service.ts");









var GameViewComponent = /** @class */ (function () {
    function GameViewComponent(soundService, meshLoaderService) {
        this.soundService = soundService;
        this.meshLoaderService = meshLoaderService;
        this.stopRenderFlag = false;
        this.isMeetingFinish = false;
        this.common = new src_app_game_common__WEBPACK_IMPORTED_MODULE_7__["ThreeCommon"]();
        this.step = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.gameStart = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.newGame = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.leaveGame = new _angular_core__WEBPACK_IMPORTED_MODULE_1__["EventEmitter"]();
        this.viewState = 'splash';
        this.gameRender = this.gameRender.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onResize = this.onResize.bind(this);
        this.animator = new _animator__WEBPACK_IMPORTED_MODULE_5__["Animator"](this.soundService);
        this.hideSplash = this.hideSplash.bind(this);
        this.init = this.init.bind(this);
    }
    GameViewComponent.prototype.ngOnChanges = function () {
        if (this.state.alias === 'gameOver') {
            this.isGameOver = this.state.additional;
        }
        else {
            this.isGameOver = false;
        }
    };
    GameViewComponent.prototype.createGameView = function (currentGame, range) {
        var _this = this;
        this.isInit = true;
        this.range = range;
        this.currentGame = currentGame;
        this.gameRenderer = new _renderer__WEBPACK_IMPORTED_MODULE_2__["Renderer"]();
        this.gameRenderer.createEnvironment(range, this.container.nativeElement);
        if (!this.meshLoaderService.load) {
            this.meshLoaderService.waitLoadData().then(function () {
                _this.init();
            });
        }
        else {
            this.init();
        }
    };
    GameViewComponent.prototype.removeAllHits = function (steps) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var z;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        z = 0;
                        this.startRender();
                        _a.label = 1;
                    case 1:
                        if (!(z < steps.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.removeHits(steps[z].hitChips)];
                    case 2:
                        _a.sent();
                        z++;
                        return [3 /*break*/, 1];
                    case 3:
                        this.stopRender();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameViewComponent.prototype.init = function () {
        this.startRender();
        this.desk = new _desk__WEBPACK_IMPORTED_MODULE_3__["Desk"](this.gameRenderer, this.meshLoaderService, this.common);
        this.desk.create(this.currentGame.cells, this.currentGame.paths);
        this.dragAndDrop = new _drag_and_drop__WEBPACK_IMPORTED_MODULE_4__["DragAndDrop"](this.gameRenderer, this.desk.getDeskMesh());
        window.addEventListener('mousedown', this.onDocumentMouseDown);
        window.addEventListener('resize', this.onResize);
        this.addTable();
        if (this.currentGame.nextStep && (this.range === this.currentGame.whosTurn)) {
            this.showNextStep();
        }
        this.stopRender();
    };
    GameViewComponent.prototype.ngOnDestroy = function () {
        window.removeEventListener('mousedown', this.onDocumentMouseDown);
        window.removeEventListener('resize', this.onResize);
    };
    GameViewComponent.prototype.restartGameView = function (currentGame, range) {
        this.desk.restart(currentGame.paths);
        this.currentGame = currentGame;
        if (this.currentGame.nextStep && (range === this.currentGame.whosTurn)) {
            this.showNextStep();
        }
        this.stopRender();
    };
    GameViewComponent.prototype.addTable = function () {
        var table = this.common.createPlaneMesh({ w: 200, h: 200 }, { x: -Math.PI / 2 }, '#fff');
        table.material.map = this.meshLoaderService.geom['table'];
        table.position.set(0, -3, 0);
        table.name = name;
        table.receiveShadow = true;
        table.material.map.wrapS = THREE.RepeatWrapping;
        table.material.map.wrapT = THREE.RepeatWrapping;
        table.material.map.repeat.set(4, 1);
        this.gameRenderer.addToScene(table);
    };
    GameViewComponent.prototype.hideSplash = function () {
        var _this = this;
        this.viewState = 'idle';
        this.startRender();
        this.animator.renderAnimation(this.gameRenderer.getCamera(), this.gameRenderer.getLight(), this.gameRenderer.getCameraPos()).then(function () {
            _this.stopRender();
            _this.gameStart.emit();
        });
        window.removeEventListener("resize", this.hideSplash);
    };
    GameViewComponent.prototype.fullScreenToggle = function (flag) {
        if (flag) {
            document.body.requestFullscreen();
            window.addEventListener("resize", this.hideSplash);
        }
        else {
            this.hideSplash();
        }
    };
    GameViewComponent.prototype.onResize = function () {
        this.startRender();
        this.gameRenderer.resize();
        this.stopRender();
    };
    GameViewComponent.prototype.gameRender = function () {
        if (!this.stopRenderFlag) {
            // console.log('render', Date.now());
            this.gameRenderer.render();
            TWEEN.update();
            requestAnimationFrame(this.gameRender);
        }
    };
    GameViewComponent.prototype.onDocumentMouseDown = function (event) {
        var _this = this;
        if ((event.which === 1) && (this.state.alias !== 'waiting') && !this.isGameOver) {
            var that_1 = this, intersects = that_1.dragAndDrop.getIntersects(event);
            var _loop_1 = function (item) {
                var target = intersects[item].object;
                if (target.meshType === 'chip') {
                    var error = this_1.currentGame.canTouch(target.name, this_1.range);
                    if (error.length) {
                        console.log('error', error);
                        this_1.viewState = 'idle';
                    }
                    else {
                        this_1.startRender();
                        this_1.viewState = 'drag';
                        that_1.dragAndDrop.start(target, function (cellName) {
                            _this.viewState = 'idle';
                            that_1.step.emit({ to: cellName, from: target.name });
                        });
                    }
                }
            };
            var this_1 = this;
            for (var item in intersects) {
                _loop_1(item);
            }
        }
        event.preventDefault();
    };
    GameViewComponent.prototype.updateCurrentGame = function (currentGame) {
        this.currentGame = currentGame;
    };
    GameViewComponent.prototype.showNextStep = function () {
        var _this = this;
        this.desk.removeHighlightCells();
        if (this.currentGame.nextStep && this.currentGame.nextStep.length) {
            this.currentGame.nextStep.forEach(function (step) {
                _this.desk.highlightCell(step.to, true);
                _this.desk.highlightCell(step.from);
            });
        }
    };
    GameViewComponent.prototype.cancelStep = function (chipName) {
        var cell = this.desk.getCellPosition(chipName), chip = this.desk.getChip(chipName);
        chip.moveTo(cell.position.x, 0.1, cell.position.z);
        this.stopRender();
    };
    GameViewComponent.prototype.stopRender = function () {
        if (this.viewState !== 'drag') {
            this.startRender();
            this.stopRenderFlag = true;
            // console.warn('stopRender')
        }
    };
    GameViewComponent.prototype.startRender = function () {
        // console.warn('startRender')
        this.stopRenderFlag = false;
        this.gameRender();
    };
    GameViewComponent.prototype.makeStep = function (chipName, cellName, anim) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var cell, chip;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cell = this.desk.getCellPosition(cellName), chip = this.desk.getChip(chipName);
                        chip.setName(cellName);
                        if (!anim) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.animator.animationMove(chip.getPosition(), { x: cell.position.x, y: 0.1, z: cell.position.z })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        chip.moveTo(cell.position.x, 0.1, cell.position.z);
                        _a.label = 3;
                    case 3: return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    GameViewComponent.prototype.newQueen = function (chipName) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var chip, camera, cameraFov, startCameraPos, chipPos, posTo;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chip = this.desk.getChip(chipName), camera = this.gameRenderer.getCamera(), cameraFov = camera.fov, startCameraPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z }, chipPos = chip.getPosition(), posTo = { x: chipPos.x, y: chipPos.y + 5, z: chipPos.z };
                        return [4 /*yield*/, this.animator.zoomTo(camera, posTo, { f: 8 }, posTo, { x: 0.89, y: -15, z: 0 })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.animator.transformToQueen(chip.getMesh())];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.animator.zoomTo(camera, startCameraPos, { f: cameraFov }, { x: 0.89, y: -15, z: 0 }, posTo)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameViewComponent.prototype.removeHits = function (hitChips) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var i, chipName, chip;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < hitChips.length)) return [3 /*break*/, 3];
                        chipName = hitChips[i];
                        chip = this.desk.getChip(chipName);
                        this.soundService.reproduceSound('remove');
                        return [4 /*yield*/, this.animator.removeFromDesk(chip.getMaterial())];
                    case 2:
                        _a.sent();
                        this.gameRenderer.removeFromScene(chip.getMesh());
                        chip.setName([]);
                        i++;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GameViewComponent.prototype.createNewGame = function () {
        this.newGame.emit();
    };
    GameViewComponent.prototype.onLeaveGame = function () {
        this.desk.clear();
        this.leaveGame.emit();
    };
    GameViewComponent.prototype.opponentDisconect = function () {
        this.isGameOver = true;
        this.isMeetingFinish = true;
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameViewComponent.prototype, "state", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameViewComponent.prototype, "isBot", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('container'),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ElementRef"])
    ], GameViewComponent.prototype, "container", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameViewComponent.prototype, "step", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameViewComponent.prototype, "gameStart", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameViewComponent.prototype, "newGame", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Output"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
    ], GameViewComponent.prototype, "leaveGame", void 0);
    GameViewComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'game-view',
            template: __webpack_require__(/*! ./game-view.component.html */ "./src/app/game/game-view.component.html"),
            styles: [__webpack_require__(/*! ./game-view.component.scss */ "./src/app/game/game-view.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_sound_service__WEBPACK_IMPORTED_MODULE_6__["SoundService"],
            src_app_services_mesh_loader_service__WEBPACK_IMPORTED_MODULE_8__["MeshLoaderService"]])
    ], GameViewComponent);
    return GameViewComponent;
}());



/***/ }),

/***/ "./src/app/game/game.component.html":
/*!******************************************!*\
  !*** ./src/app/game/game.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<game-view \n    (newGame)=\"newGame()\" \n    (gameStart)=\"onGameStart()\" \n    [state]=\"state\" \n    (step)=\"onStep($event)\"\n    [isBot]=\"isBot\"\n    (leaveGame)=\"leaveGame()\"></game-view>\n<game-interface \n    [soundState]=\"soundState\"\n    (newGame)=\"finishGame()\" \n    [ngClass]=\"{'show': gameStart}\" \n    (onSoundSwitch)=\"onSoundSwitch()\"\n    [data]=\"interfaceData\"></game-interface>"

/***/ }),

/***/ "./src/app/game/game.component.ts":
/*!****************************************!*\
  !*** ./src/app/game/game.component.ts ***!
  \****************************************/
/*! exports provided: GameComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameComponent", function() { return GameComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var src_app_services_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _checkers_checkers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./checkers/checkers */ "./src/app/game/checkers/checkers.ts");
/* harmony import */ var src_app_game_game_view_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/game/game-view.component */ "./src/app/game/game-view.component.ts");
/* harmony import */ var src_app_services_meetings_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/services/meetings.service */ "./src/app/services/meetings.service.ts");
/* harmony import */ var src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/services/auth.service */ "./src/app/services/auth.service.ts");
/* harmony import */ var src_app_services_sound_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/services/sound.service */ "./src/app/services/sound.service.ts");
/* harmony import */ var src_app_game_step_generator_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/game/step-generator.service */ "./src/app/game/step-generator.service.ts");










var GameComponent = /** @class */ (function () {
    function GameComponent(dataService, meetingsService, authService, soundService, stepGeneratorService, router) {
        this.dataService = dataService;
        this.meetingsService = meetingsService;
        this.authService = authService;
        this.soundService = soundService;
        this.stepGeneratorService = stepGeneratorService;
        this.router = router;
        this.isStart = false;
        this.interfaceData = [];
        this.isGameOver = false;
        this.steps = [];
        this.state = { alias: 'waiting', additional: null };
        this.gameStart = false;
        this.isRestart = false;
        this.checkers = _checkers_checkers__WEBPACK_IMPORTED_MODULE_4__["Checkers"];
    }
    GameComponent.prototype.setState = function () {
        if (this.dataService.isStart() || this.currentGame.bot) {
            this.state = { alias: 'start', additional: null };
        }
        else {
            this.state = { alias: 'waiting', additional: null };
        }
        if (this.currentGame && this.currentGame.whoWin) {
            this.state = { alias: 'gameOver', additional: this.currentGame.whoWin };
            if (this.getRange() === this.currentGame.whoWin) {
                this.soundService.reproduceSound('win');
            }
            else {
                this.soundService.reproduceSound('loose');
            }
        }
    };
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dataService$ = this.dataService.getCurrentGame()
            .subscribe(function (currentGame) {
            if (currentGame && currentGame.paths) {
                _this.currentGame = _this.checkers.getGame(currentGame);
                if (_this.currentGame.bot) {
                    _this.isBot = true;
                }
                var range = _this.getRange();
                if (_this.currentGame && !_this.gameViewComponent.isInit) {
                    _this.gameViewComponent.createGameView(_this.currentGame, range);
                }
                if (!_this.isStart && _this.dataService.isStart()) {
                    _this.setState();
                    _this.isStart = true;
                }
                if (_this.isRestart) {
                    _this.gameViewComponent.restartGameView(_this.currentGame, range);
                    _this.isRestart = false;
                }
                _this.updateInterface();
                if (!_this.currentGame.nextStep) {
                    _this.currentGame.setNextStep();
                }
                _this.gameViewComponent.updateCurrentGame(_this.currentGame);
            }
            else if (_this.isStart) {
                _this.gameViewComponent.opponentDisconect();
            }
            console.log(currentGame, _this.isStart);
        });
        this.meetingsService.removeSteps();
        this.meetingsService$ = this.meetingsService.stepHandler().subscribe(function (steps) { return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](_this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                if (steps.steps) {
                    this.stepHandler(steps.steps);
                }
                else if (this.currentGame && this.currentGame.whoWin) {
                    this.setState();
                }
                return [2 /*return*/];
            });
        }); });
        this.soundService.getState().subscribe(function (state) {
            _this.soundState = state;
        });
    };
    GameComponent.prototype.onSoundSwitch = function () {
        this.soundService.soundToggle();
    };
    GameComponent.prototype.ngOnDestroy = function () {
        this.meetingsService$.unsubscribe();
        this.dataService$.unsubscribe();
        this.meetingsService.removeSteps();
    };
    GameComponent.prototype.updateInterface = function () {
        this.compareData({
            score: this.dataService.getPlayers(),
            playerId: this.authService.getUserId(),
            hitsChips: this.currentGame.hitsChips,
            players: this.currentGame.players,
            whosTurn: this.currentGame.whosTurn,
            maxHits: this.currentGame.maxHits
        });
    };
    GameComponent.prototype.getRange = function () {
        var userId = this.currentGame.bot ? 'you' : this.authService.getUserId();
        var range;
        this.currentGame.players.forEach(function (player) {
            if (player.id === userId) {
                range = player.range;
            }
        });
        return range;
    };
    GameComponent.prototype.compareData = function (data) {
        var d = [];
        data.players.forEach(function (player, index) {
            var score;
            data.score.forEach(function (s) {
                if (s.id === player.id) {
                    score = s;
                }
            });
            d.push({
                id: player.id,
                range: player.range,
                hitsChips: data.hitsChips[player.range],
                currentPlayer: (data.playerId === player.id),
                score: score,
                turn: (player.range === data.whosTurn),
                maxHits: data.maxHits
            });
        });
        this.interfaceData = d;
    };
    GameComponent.prototype.postStep = function (ifOpponent, step, multiStep) {
        if (multiStep === void 0) { multiStep = false; }
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var newQueen;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newQueen = (this.currentGame.newQueen) ? this.currentGame.newQueen.slice() : null;
                        if (newQueen && ((step.to[0] !== newQueen[0]) || (step.to[1] !== newQueen[1]))) {
                            newQueen = null;
                        }
                        if (!multiStep) {
                            this.updateInterface();
                        }
                        if (!newQueen) return [3 /*break*/, 2];
                        this.soundService.reproduceSound('queen');
                        return [4 /*yield*/, this.gameViewComponent.newQueen(newQueen)];
                    case 1:
                        _a.sent();
                        this.currentGame.newQueen = null;
                        _a.label = 2;
                    case 2:
                        if (!multiStep && this.currentGame.nextStep) {
                            this.gameViewComponent.showNextStep();
                        }
                        if (!multiStep) {
                            this.setState();
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameComponent.prototype.makeStep = function (hitChips, step, ifOpponent, multiStep) {
        if (ifOpponent === void 0) { ifOpponent = false; }
        if (multiStep === void 0) { multiStep = false; }
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.gameViewComponent.startRender();
                        return [4 /*yield*/, this.gameViewComponent.makeStep(step.from, step.to, ifOpponent)];
                    case 1:
                        _a.sent();
                        this.soundService.reproduceSound('step');
                        return [4 /*yield*/, this.postStep(ifOpponent, step, multiStep)];
                    case 2:
                        _a.sent();
                        this.gameViewComponent.stopRender();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameComponent.prototype.stepHandler = function (steps) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var i, step;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < steps.length)) return [3 /*break*/, 6];
                        step = steps[i];
                        if (!step.step) return [3 /*break*/, 5];
                        if (!(i === steps.length - 1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.makeStep(step.hitChips, step.step, true)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.makeStep(step.hitChips, step.step, true, true)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6: return [4 /*yield*/, this.gameViewComponent.removeAllHits(steps)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GameComponent.prototype.onStep = function (step) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var hitChips;
            var _this = this;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                switch (_a.label) {
                    case 0:
                        hitChips = this.currentGame.makeStep(step);
                        if (!(hitChips === undefined)) return [3 /*break*/, 1];
                        this.gameViewComponent.cancelStep(step.from);
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.makeStep(hitChips, step)];
                    case 2:
                        _a.sent();
                        this.steps.push({ step: step, hitChips: hitChips });
                        if (!this.currentGame.nextStep || (this.currentGame.nextStep.length === 0)) {
                            this.gameViewComponent.removeAllHits(this.steps);
                            if (!this.currentGame.bot) {
                                this.meetingsService.makeStep(this.steps.slice(), this.authService.getPlayerId());
                            }
                            else {
                                if (!this.currentGame.whoWin) {
                                    setTimeout(function () {
                                        var gen = new _checkers_checkers__WEBPACK_IMPORTED_MODULE_4__["StepGenerator"]();
                                        gen.init(_this.currentGame);
                                        var data = gen.getStep();
                                        data.steps.forEach(function (step) {
                                            _this.currentGame.makeStep(step.step, data.steps.length);
                                        });
                                        _this.currentGame.setNextStep();
                                        _this.dataService.setCurrentGame(_this.currentGame);
                                        _this.meetingsService.opponentStep(data.steps);
                                        _this.steps = [];
                                        gen = null;
                                    }, 500);
                                }
                            }
                            this.steps = [];
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GameComponent.prototype.newGame = function () {
        this.isStart = false;
        this.isRestart = true;
        this.meetingsService.newGame(this.authService.getPlayerId());
    };
    GameComponent.prototype.finishGame = function () {
        this.isStart = false;
        this.isRestart = true;
        this.meetingsService.finishGame(this.authService.getPlayerId());
    };
    GameComponent.prototype.onGameStart = function () {
        this.gameStart = true;
    };
    GameComponent.prototype.leaveGame = function () {
        this.authService.inGame(null, null);
        this.router.navigate(['/']);
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])(src_app_game_game_view_component__WEBPACK_IMPORTED_MODULE_5__["GameViewComponent"]),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", src_app_game_game_view_component__WEBPACK_IMPORTED_MODULE_5__["GameViewComponent"])
    ], GameComponent.prototype, "gameViewComponent", void 0);
    GameComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            template: __webpack_require__(/*! ./game.component.html */ "./src/app/game/game.component.html")
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"],
            src_app_services_meetings_service__WEBPACK_IMPORTED_MODULE_6__["MeetingsService"],
            src_app_services_auth_service__WEBPACK_IMPORTED_MODULE_7__["AuthService"],
            src_app_services_sound_service__WEBPACK_IMPORTED_MODULE_8__["SoundService"],
            src_app_game_step_generator_service__WEBPACK_IMPORTED_MODULE_9__["StepGeneratorService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], GameComponent);
    return GameComponent;
}());



/***/ }),

/***/ "./src/app/game/game.module.ts":
/*!*************************************!*\
  !*** ./src/app/game/game.module.ts ***!
  \*************************************/
/*! exports provided: GameModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameModule", function() { return GameModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var src_app_game_game_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/game/game.component */ "./src/app/game/game.component.ts");
/* harmony import */ var src_app_game_game_view_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/game/game-view.component */ "./src/app/game/game-view.component.ts");
/* harmony import */ var _game_interface_game_interface_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./game-interface/game-interface.component */ "./src/app/game/game-interface/game-interface.component.ts");
/* harmony import */ var src_app_game_game_over_game_over_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/game/game-over/game-over.component */ "./src/app/game/game-over/game-over.component.ts");
/* harmony import */ var src_app_game_step_generator_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/game/step-generator.service */ "./src/app/game/step-generator.service.ts");









var GameModule = /** @class */ (function () {
    function GameModule() {
    }
    GameModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                src_app_game_game_component__WEBPACK_IMPORTED_MODULE_4__["GameComponent"],
                src_app_game_game_view_component__WEBPACK_IMPORTED_MODULE_5__["GameViewComponent"],
                _game_interface_game_interface_component__WEBPACK_IMPORTED_MODULE_6__["GameInterfaceComponent"],
                src_app_game_game_over_game_over_component__WEBPACK_IMPORTED_MODULE_7__["GameOverComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                    {
                        path: '',
                        component: src_app_game_game_component__WEBPACK_IMPORTED_MODULE_4__["GameComponent"]
                    }
                ])
            ],
            providers: [src_app_game_step_generator_service__WEBPACK_IMPORTED_MODULE_8__["StepGeneratorService"]]
        })
    ], GameModule);
    return GameModule;
}());



/***/ }),

/***/ "./src/app/game/game.settings.ts":
/*!***************************************!*\
  !*** ./src/app/game/game.settings.ts ***!
  \***************************************/
/*! exports provided: GameSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GameSettings", function() { return GameSettings; });
var GameSettings = /** @class */ (function () {
    function GameSettings() {
        this.deskSize = { w: 90, h: 90, deep: 4 };
        this.deskPlayZoneSize = { w: 80, h: 80 };
        this.deskPosition = { x: 0, y: -this.deskSize.deep / 2, z: 0 };
        this.cellSize = {
            w: 10,
            h: 10
        };
        this.fontSize = 10;
        this.cellsColors = {
            'w': '#fff',
            'b': '#412e2a'
        };
        this.chipsColors = {
            'w': '#f6ebdb',
            'ww': '#f6ebdb',
            'b': '#382f23',
            'bb': '#382f23'
        };
        this.deskColor = '#f9deab';
    }
    return GameSettings;
}());



/***/ }),

/***/ "./src/app/game/renderer.ts":
/*!**********************************!*\
  !*** ./src/app/game/renderer.ts ***!
  \**********************************/
/*! exports provided: Renderer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Renderer", function() { return Renderer; });
var Renderer = /** @class */ (function () {
    function Renderer() {
        this.angle = 0;
        this.radius = 500;
    }
    Renderer.prototype.createEnvironment = function (range, container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.scene.add(this.camera);
        this.range = range;
        this.addLight();
        if (range === 'b') {
            // spotLight.position.set(0, 90, 100);
        }
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.shadowMapSoft = true;
        // this.renderer.sortObjects = true;
        // this.renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
        // this.renderer.setClearColor( 0xffffff, 1 );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap = true;
        var devicePixelRatio = (window.devicePixelRatio > 1) ? 1 : window.devicePixelRatio;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        this.setInitialCamera();
    };
    Renderer.prototype.addLight = function () {
        var ambientLight = new THREE.AmbientLight(0x3a3a3a);
        this.scene.add(ambientLight);
        ambientLight.intensity = 0.3;
        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight(0xe0e0e0);
        // this.spotLight.position.set(0, 39, 65);
        this.spotLight.angle = 1;
        this.spotLight.position.set(0, 20, 0);
        this.spotLight.intensity = 0;
        this.spotLight.distance = 0;
        this.spotLight.penumbra = 0.5;
        // this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);
    };
    Renderer.prototype.getLight = function () {
        return this.spotLight;
    };
    Renderer.prototype.setInitialCamera = function () {
        this.setCameraPos(250, 80, 0);
        this.camera.fov = 20;
        this.camera.lookAt(new THREE.Vector3(0.89, -15, 0));
        this.camera.updateProjectionMatrix();
    };
    Renderer.prototype.getCameraPos = function () {
        if (this.range === 'w') {
            return { x: 1, y: 110, z: 110 };
        }
        else {
            return { x: 0.5, y: 110, z: -110 };
        }
    };
    Renderer.prototype.setCamera = function () {
        if (this.range === 'w') {
            this.setCameraPos(1, 110, 110);
        }
        else {
            this.setCameraPos(0.5, 110, -110);
        }
    };
    Renderer.prototype.setCameraPos = function (x, y, z) {
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(0.89, -15, 0));
    };
    Renderer.prototype.zoomTo = function (pos) {
        this.camera.position.x = pos.x;
        this.camera.lookAt(new THREE.Vector3(pos.x, pos.y + 6, pos.z));
        this.camera.fov *= 0.199;
        this.camera.updateProjectionMatrix();
    };
    Renderer.prototype.render = function () {
        this.show();
    };
    Renderer.prototype.resize = function () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };
    Renderer.prototype.show = function () {
        this.renderer.render(this.scene, this.camera);
    };
    Renderer.prototype.addToScene = function (mesh) {
        this.scene.add(mesh);
    };
    Renderer.prototype.removeFromScene = function (mesh) {
        this.scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
        mesh = undefined;
    };
    Renderer.prototype.getScene = function () {
        return this.scene;
    };
    Renderer.prototype.getDomElement = function () {
        return this.renderer.domElement;
    };
    Renderer.prototype.getRenderer = function () {
        return this.renderer;
    };
    Renderer.prototype.getCamera = function () {
        return this.camera;
    };
    Renderer.prototype.getControls = function () {
        return this.controls;
    };
    return Renderer;
}());



/***/ }),

/***/ "./src/app/game/step-generator.service.ts":
/*!************************************************!*\
  !*** ./src/app/game/step-generator.service.ts ***!
  \************************************************/
/*! exports provided: StepGeneratorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StepGeneratorService", function() { return StepGeneratorService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var StepGeneratorService = /** @class */ (function () {
    function StepGeneratorService() {
    }
    StepGeneratorService.prototype.onStep = function (step) {
        console.log(step);
    };
    StepGeneratorService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])()
    ], StepGeneratorService);
    return StepGeneratorService;
}());



/***/ }),

/***/ "./src/app/services/mesh-loader.service.ts":
/*!*************************************************!*\
  !*** ./src/app/services/mesh-loader.service.ts ***!
  \*************************************************/
/*! exports provided: MeshLoaderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MeshLoaderService", function() { return MeshLoaderService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var MeshLoaderService = /** @class */ (function () {
    function MeshLoaderService() {
        this.models = {
            'chip': 'assets/models/piece.js',
        };
        this.textures = {
            'treeTexture': 'assets/desk.jpg',
            'table': 'assets/table.jpg',
            'cell': 'assets/floor-wood-small.jpg'
        };
        this.fonts = {
            'helvetica': 'assets/fonts/helvetiker_regular.typeface.json'
        };
        this.geom = {};
        this.load = false;
    }
    // treeTexture = new THREE.TextureLoader().load( 'assets/floor-wood.jpg' );
    // treeTextureSmall = new THREE.TextureLoader().load( 'assets/floor-wood-small.jpg' );
    MeshLoaderService.prototype.loadFromTo = function (from, to, type) {
        var loader;
        switch (type) {
            case 'json':
                loader = new THREE.JSONLoader();
                break;
            case 'texture':
                loader = new THREE.TextureLoader();
                break;
            case 'text':
                loader = new THREE.FontLoader();
                break;
        }
        var objLength = 0;
        for (var z in from) {
            objLength++;
        }
        var loaded = 0;
        return new Promise(function (res, rej) {
            var _loop_1 = function (z) {
                loader.load(from[z], function (geometry) {
                    loaded++;
                    to[z] = geometry;
                    if (objLength === loaded) {
                        res();
                    }
                });
            };
            for (var z in from) {
                _loop_1(z);
            }
        });
    };
    MeshLoaderService.prototype.loadFinish = function () {
        this.load = true;
        return Promise.resolve();
    };
    MeshLoaderService.prototype.waitLoadData = function () {
        return Promise.all([
            this.loadFromTo(this.models, this.geom, 'json'),
            this.loadFromTo(this.textures, this.geom, 'texture'),
            this.loadFromTo(this.fonts, this.geom, 'text'),
            this.loadFinish()
        ]);
    };
    MeshLoaderService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' })
    ], MeshLoaderService);
    return MeshLoaderService;
}());



/***/ })

}]);
//# sourceMappingURL=game-game-module.js.map