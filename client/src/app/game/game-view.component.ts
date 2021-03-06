import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';

import { Renderer } from './renderer';
import { MeshLoader } from './mesh-loader';
import { Desk } from './desk';
import { DragAndDrop } from './drag-and-drop';
import { Animator } from './animator';
import { SoundService } from 'src/app/services/sound.service';
import { ThreeCommon } from 'src/app/game/common';

declare var THREE: any;
declare var TWEEN: any;

@Component({
    selector: 'game-view',
    styleUrls: ['./game-view.component.scss'],
    templateUrl: './game-view.component.html'
}) 
export class GameViewComponent {
    gameRenderer;
    meshLoader;
    currentGame;
    range;
    desk;
    checkers;
    dragAndDrop;
    isInit;
    isGameOver;
    animator;
    stopRenderFlag = false;
    common = new ThreeCommon();
    @Input() state;
    @ViewChild('container') container: ElementRef;
    @Output() step = new EventEmitter<any>();
    @Output() gameStart = new EventEmitter<any>();
    viewState = 'splash';

    constructor(
        private soundService: SoundService
    ) {
        this.gameRender = this.gameRender.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onResize = this.onResize.bind(this);
        this.animator = new Animator(this.soundService);
        this.hideSplash = this.hideSplash.bind(this);
    }

    ngOnChanges() {
        if (this.state.alias === 'gameOver') {
            this.isGameOver = this.state.additional;
        }
    }

    createGameView(currentGame, range) {
        this.isInit = true;
        this.range = range;
        this.currentGame = currentGame;
        this.gameRenderer = new Renderer();
        this.gameRenderer.createEnvironment(range, this.container.nativeElement);
        // this.gameRenderer.setCamera()
        this.meshLoader = new MeshLoader();
        this.meshLoader.waitLoadData().then(() => {  
            this.startRender();   
            this.desk = new Desk(this.gameRenderer, this.meshLoader, this.common);
            this.desk.create(currentGame.cells, currentGame.paths);
            this.dragAndDrop = new DragAndDrop(this.gameRenderer, this.desk.getDeskMesh());
            window.addEventListener('mousedown', this.onDocumentMouseDown);
            window.addEventListener('resize', this.onResize);
            this.addTable();

            if (this.currentGame.nextStep) {
                this.showNextStep();
            }
            this.stopRender();
        });
    }

    addTable() {
        const table = this.common.createPlaneMesh(
            {w: 200, h: 200},
            {x: -Math.PI / 2},
            '#fff'
        );
        table.material.map = this.meshLoader.geom['table'];
        table.position.set(0, -3, 0);
        table.name = name;
        table.receiveShadow = true;
        table.material.map.wrapS = THREE.RepeatWrapping;
        table.material.map.wrapT = THREE.RepeatWrapping;
        table.material.map.repeat.set(4, 1);
        this.gameRenderer.addToScene(table);  
    }

    hideSplash() {
        this.viewState = 'idle';

        this.startRender();
        this.animator.renderAnimation(this.gameRenderer.getCamera(), this.gameRenderer.getLight(), this.gameRenderer.getCameraPos()).then(() => {
            this.stopRender();
            this.gameStart.emit();
        });
        window.removeEventListener("resize", this.hideSplash);
    }

    fullScreenToggle(flag) {
        if (flag) {
            document.body.requestFullscreen();
            window.addEventListener("resize", this.hideSplash);
        } else {
            this.hideSplash();
        }
    }

    onResize() {
        this.startRender();
        this.gameRenderer.resize();
        this.stopRender();
    }

    gameRender() {
        if (!this.stopRenderFlag) {
            // console.log('render', Date.now());
            this.gameRenderer.render();
            TWEEN.update();
            requestAnimationFrame(this.gameRender);
        }
    }

    onDocumentMouseDown(event) {
        if ((this.state.alias !== 'waiting') && !this.isGameOver) {
            const that = this,
                intersects = that.dragAndDrop.getIntersects(event);
            
            for (let item in intersects) {
                const target = intersects[item].object;

                if (target.meshType === 'chip') {
                    let error = this.currentGame.canTouch(target.name, this.range);

                    if (error.length) {
                        console.log( 'error', error );
                        this.viewState = 'idle';
                    } else {
                        this.startRender();
                        this.viewState = 'drag';

                        that.dragAndDrop.start(target, (cellName) => {
                            this.viewState = 'idle';
                            let cell = that.desk.getCellPosition(cellName);
                            that.step.emit({to: cellName, from: target.name});
                        });
                    }
                }
            }
        }

        event.preventDefault();
    }

    updateCurrentGame(currentGame) {
        this.currentGame = currentGame;
    }

    showNextStep() {
        this.desk.removeHighlightCells(); 
       
        if (this.currentGame.nextStep && this.currentGame.nextStep.length) {
            this.currentGame.nextStep.forEach(step => {
                this.desk.highlightCell(step.to, true); 
                this.desk.highlightCell(step.from);            
            });
        }
    }

    cancelStep(chipName) {
        let cell = this.desk.getCellPosition(chipName),
            chip = this.desk.getChip(chipName);
        chip.moveTo(cell.position.x, 0.1, cell.position.z);
        this.stopRender();
    }

    stopRender() {
        if (this.viewState !== 'drag') {
            this.startRender();
            this.stopRenderFlag = true;
            console.warn('stopRender')
        }
    }

    startRender() {
        console.warn('startRender')
        this.stopRenderFlag = false;
        this.gameRender();
    }

    async makeStep(chipName, cellName, anim) {
        let cell = this.desk.getCellPosition(cellName),
            chip = this.desk.getChip(chipName);

        chip.setName(cellName);
        
        if (anim) {
            await this.animator.animationMove(chip.getPosition(), {x: cell.position.x, y: 0.1, z: cell.position.z});
        } else {
            chip.moveTo(cell.position.x, 0.1, cell.position.z);
        }

        return Promise.resolve();
    }

    async newQueen(chipName) {
        let chip = this.desk.getChip(chipName),
            camera = this.gameRenderer.getCamera(),
            cameraFov = camera.fov,
            startCameraPos = {x: camera.position.x, y: camera.position.y, z: camera.position.z},
            chipPos = chip.getPosition(),
            posTo = {x: chipPos.x, y: chipPos.y + 5, z: chipPos.z};
        await this.animator.zoomTo(camera, posTo, {f: 8}, posTo, {x: 0.89, y: -15, z: 0});
        await this.animator.transformToQueen(chip.getMesh());
        await this.animator.zoomTo(camera, startCameraPos, {f: cameraFov}, {x: 0.89, y: -15, z: 0}, posTo);
    }

    async removeHits(hitChips) {
        let i = 0;
        while (i < hitChips.length) {
            let chipName = hitChips[i];
            let chip = this.desk.getChip(chipName);
            await this.animator.removeFromDesk(chip.getMaterial())
            this.gameRenderer.removeFromScene(chip.getMesh());
            chip.setName([]);
            i++;
        }
    }
}


//todo два шага дается - после первого шага попадаем в дамки - у опонента не происходит трансформации