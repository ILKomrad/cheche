import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Renderer } from './renderer';
import { MeshLoader } from './mesh-loader';
import { Desk } from './desk';
import { ThreeCommon } from './common';

declare var THREE: any;

@Component({
    templateUrl: './game.component.html'
})
export class GameComponent {
    gameRenderer;
    meshLoader;
    common;
    currentGame;
    desk;
    @ViewChild('container') container: ElementRef;

    constructor(
        private dataService: DataService
    ) {
        this.gameRender = this.gameRender.bind(this);
    }

    ngAfterViewInit() {
        this.dataService.getData()
        .subscribe(data => {
            if (data) {
                this.currentGame = this.dataService.getCurrentGame();
                
                if (this.currentGame) { this.createGameView(); }
            }
        })
    }

    createGameView() {
        this.gameRenderer = new Renderer();
        this.common = new ThreeCommon();
        this.gameRenderer.createEnvironment(1, this.container.nativeElement);
        this.meshLoader = new MeshLoader();
        this.meshLoader.waitLoadData().then(() => {     
            this.desk = new Desk(this.gameRenderer, this.common, this.meshLoader);
            this.desk.create(this.currentGame.cells, this.currentGame.paths);
            this.gameRender();
        });
    }

    gameRender() {
        requestAnimationFrame(this.gameRender);
        this.gameRenderer.render();
    }
}