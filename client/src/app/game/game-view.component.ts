import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';

import { Renderer } from './renderer';
import { MeshLoader } from './mesh-loader';
import { Desk } from './desk';
import { ThreeCommon } from './common';
import { DragAndDrop } from './drag-and-drop';
import { GameSettings } from './game.settings';

declare var THREE: any;
declare var TWEEN: any;

@Component({
    selector: 'game-view',
    template: '<div #container id="container"></div>'
}) 
export class GameViewComponent {
    gameRenderer;
    meshLoader;
    common;
    currentGame;
    desk;
    checkers;
    dragAndDrop;
    isInit;
    gameSettings;
    @Input() isStart;
    @ViewChild('container') container: ElementRef;
    @Output() step = new EventEmitter<any>();

    constructor() {
        this.gameRender = this.gameRender.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.gameSettings = new GameSettings();
    }

    createGameView(currentGame, range) {
        this.isInit = true;
        this.gameRenderer = new Renderer();
        this.common = new ThreeCommon();
        this.gameRenderer.createEnvironment(range, this.container.nativeElement);
        this.meshLoader = new MeshLoader();
        this.meshLoader.waitLoadData().then(() => {     
            this.desk = new Desk(this.gameRenderer, this.common, this.meshLoader, this.gameSettings);
            this.desk.create(currentGame.cells, currentGame.paths);
            this.gameRender();
            this.dragAndDrop = new DragAndDrop(this.gameRenderer, this.desk.getDeskMesh());
            window.addEventListener('mousedown', this.onDocumentMouseDown);
        });
    }

    gameRender() {
        requestAnimationFrame(this.gameRender);
        this.gameRenderer.render();
        TWEEN.update();
    }

    onDocumentMouseDown(event) {
        if (this.isStart) {
            const that = this,
                intersects = that.dragAndDrop.getIntersects(event);

            for (let item in intersects) {
                const target = intersects[item].object;
                
                if (target.meshType === 'chip') {
                    that.dragAndDrop.start(target, function(cellName) {
                        let cell = that.desk.getCellPosition(cellName);
                        that.step.emit({to: cellName, from: target.name})
                    });
                }
            }
        }

        event.preventDefault();
    }

    cancelStep(chipName) {
        console.log('cancel')
        let cell = this.desk.getCellPosition(chipName),
            chip = this.desk.getChip(chipName);
        chip.moveTo(cell.position.x, 0.1, cell.position.z);
        // target.position.set(cell.position.x, 0.1, cell.position.z);
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

    removeHits(chipName) {
        this.desk.removeHits(chipName);
    }
}