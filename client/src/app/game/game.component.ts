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
    interfaceData;

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
                this.isStart = this.dataService.isStart();
                this.currentGame = currentGame;
                this.currentGame = this.checkers.getGame(currentGame);
             
                if (this.currentGame && !this.gameViewComponent.isInit) { 
                    const range = this.getRange();
                    this.gameViewComponent.createGameView(this.currentGame, range); 
                    this.compareData({
                        score: this.dataService.getPlayers(),
                        playerId: this.authService.getUserId(),
                        hitsChips: this.currentGame.hitsChips,
                        players: this.currentGame.players
                    });
                }
            }
        });

        this.meetingsService.stepHandler().subscribe(step => {
            if (step.step) {
                this.makeStep(step.hitChips, step.step, true);
            }
        })
    }

    getRange() {
        const userId = this.authService.getUserId();
        let range;
        this.currentGame.players.forEach(player => {
            if (player.id === userId) {
                range = player.range;
            }
        });

        return range;
    }

    compareData(data) {
        let d = [];
        console.log(data)

        data.players.forEach((player, index) => {
           let score;

           data.score.forEach(s => {
               if (s.id === player.id) {
                   score = s;
               }
           })

            d.push({
                id: player.id,
                range: player.range,
                hitsChips: data.hitsChips[player.range],
                currentPlayer: (data.playerId === player.id),
                score
            })
        })
        this.interfaceData = d;
    }

    makeStep(hitChips, step, ifOpponent = false) {
        this.gameViewComponent.makeStep(step.from, step.to, ifOpponent);

        if (hitChips.length) {
            hitChips.forEach(h => {
                this.gameViewComponent.removeHits(h);
            })
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