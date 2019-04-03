import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { Checkers } from './checkers/checkers';
import { GameViewComponent } from 'src/app/game/game-view.component';
import { MeetingsService } from 'src/app/services/meetings.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
    templateUrl: './game.component.html'
})
export class GameComponent {
    currentGame;
    checkers;
    isStart = false;

    @ViewChild(GameViewComponent)
    private gameViewComponent: GameViewComponent;

    constructor(
        private dataService: DataService,
        private meetingsService: MeetingsService,
        private authService: AuthService
    ) {
        this.checkers = Checkers;
        this.isStart = false;
    }

    ngAfterViewInit() {
        this.dataService.getCurrentGame()
        .subscribe(currentGame => {
            if (currentGame) {
                console.log( this.isStart )
                this.isStart = this.dataService.isStart();
                this.currentGame = currentGame;
                this.currentGame = this.checkers.getGame(currentGame);
    
                if (this.currentGame && !this.gameViewComponent.isInit) { 
                    this.gameViewComponent.createGameView(this.currentGame); 
                }
            }
        });

        this.meetingsService.stepHandler().subscribe(step => {
            console.log( step );
            if (step.step) {
                this.makeStep(step.hitChips, step.step);
            }
        })
    }

    makeStep(hitChips, step) {
        this.gameViewComponent.makeStep(step.from, step.to);

        if (hitChips.length) {
            this.gameViewComponent.removeHits(hitChips[0]);
        }
    }

    onStep(step) {
        let hitChips = this.currentGame.checkValidStep(step.from, step.to);

        if (hitChips === undefined) {
            this.gameViewComponent.cancelStep(step.from);
        } else {
            this.makeStep(hitChips, step);

            this.meetingsService.makeStep(step, hitChips, this.authService.getPlayerId());
        }
    }
}