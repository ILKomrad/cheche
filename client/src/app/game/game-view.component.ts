import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';

import { Renderer } from './renderer';
import { MeshLoader } from './mesh-loader';
import { Desk } from './desk';
import { DragAndDrop } from './drag-and-drop';

declare var THREE: any;
declare var TWEEN: any;

@Component({
    selector: 'game-view',
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
    @Input() state;
    @ViewChild('container') container: ElementRef;
    @Output() step = new EventEmitter<any>();

    constructor() {
        this.gameRender = this.gameRender.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onResize = this.onResize.bind(this);
    }

    ngOnChanges() {
        if (this.state.alias === 'gameOver') {
            this.isGameOver = this.state.additional;

            if (this.range === this.isGameOver) {
                console.log('%c YOU WIN ', 'background: red; color: #fff');
            } else {
                console.log('%c YOU loose ', 'background: red; color: #fff');
            }
        }
    }

    createGameView(currentGame, range) {
        this.isInit = true;
        this.range = range;
        this.currentGame = currentGame;
        this.gameRenderer = new Renderer();
        this.gameRenderer.createEnvironment(range, this.container.nativeElement);
        this.meshLoader = new MeshLoader();
        this.meshLoader.waitLoadData().then(() => {     
            this.desk = new Desk(this.gameRenderer, this.meshLoader);
            this.desk.create(currentGame.cells, currentGame.paths);
            this.gameRender();
            this.dragAndDrop = new DragAndDrop(this.gameRenderer, this.desk.getDeskMesh());
            window.addEventListener('mousedown', this.onDocumentMouseDown);
            window.addEventListener('resize', this.onResize);
        });
    }

    onResize() {
        this.gameRenderer.resize();
    }

    gameRender() {
        requestAnimationFrame(this.gameRender);
        this.gameRenderer.render();
        TWEEN.update();
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
                    } else {
                        console.log( 'valid step' );
                    }
                    console.log( target.name )
                    that.dragAndDrop.start(target, function(cellName) {
                        let cell = that.desk.getCellPosition(cellName);
                        that.step.emit({to: cellName, from: target.name});
                    });
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

        if (this.currentGame.nextStep) {
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
    }

    async makeStep(chipName, cellName, anim) {
        let cell = this.desk.getCellPosition(cellName),
            chip = this.desk.getChip(chipName);

        chip.setName(cellName);

        if (anim) {
            await chip.animateMoveTo(cell.position.x, 0.1, cell.position.z);
        } else {
            chip.moveTo(cell.position.x, 0.1, cell.position.z);
        }

        return Promise.resolve();
    }

    newQueen(chipName) {
        let chip = this.desk.getChip(chipName);
        chip.transformToQueen();
    }

    removeHits(chipName) {
        this.desk.removeHits(chipName);
    }
}