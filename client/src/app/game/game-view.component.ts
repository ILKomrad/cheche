import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';

import { Renderer } from './renderer';
import { MeshLoader } from './mesh-loader';
import { Desk } from './desk';
import { ThreeCommon } from './common';
import { DragAndDrop } from './drag-and-drop';

declare var THREE: any;

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
    @Input() isStart;
    @ViewChild('container') container: ElementRef;
    @Output() step = new EventEmitter<any>();

    constructor() {
        this.gameRender = this.gameRender.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    }

    createGameView(currentGame) {
        console.log( 'this.isInit' )
        this.isInit = true;
        this.gameRenderer = new Renderer();
        this.common = new ThreeCommon();
        this.gameRenderer.createEnvironment(1, this.container.nativeElement);
        this.meshLoader = new MeshLoader();
        this.meshLoader.waitLoadData().then(() => {     
            this.desk = new Desk(this.gameRenderer, this.common, this.meshLoader);
            this.desk.create(currentGame.cells, currentGame.paths);
            this.gameRender();
            this.dragAndDrop = new DragAndDrop(this.gameRenderer, this.desk.getDeskMesh());
            window.addEventListener('mousedown', this.onDocumentMouseDown);
        });
    }

    gameRender() {
        requestAnimationFrame(this.gameRender);
        this.gameRenderer.render();
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
        let cell = this.desk.getCellPosition(chipName),
            chip = this.desk.getChip(chipName);
        chip.moveTo(cell.position.x, 0.1, cell.position.z);
        // target.position.set(cell.position.x, 0.1, cell.position.z);
    }

    makeStep(chipName, cellName) {
        let cell = this.desk.getCellPosition(cellName),
            chip = this.desk.getChip(chipName);
        chip.moveTo(cell.position.x, 0.1, cell.position.z);
        chip.setName(cellName);
    }

    removeHits(chipName) {
        let chip = this.desk.getChip(chipName);
        chip.remove();
    }
}