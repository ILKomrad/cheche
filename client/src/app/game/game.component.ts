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
    isGameOver = false;
    state = {alias: 'waiting', additional: null};

    @ViewChild(GameViewComponent)
    private gameViewComponent: GameViewComponent;

    constructor(
        private dataService: DataService,
        private meetingsService: MeetingsService,
        private authService: AuthService
    ) {
        this.checkers = Checkers;
    }

    setState() {
        if (this.dataService.isStart()) {
            this.state = {alias: 'start', additional: null};
        } else {
            this.state = {alias: 'waiting', additional: null};
        }

        if (this.currentGame && this.currentGame.whoWin) {
            this.state = {alias: 'gameOver', additional: this.currentGame.whoWin};
        }
    }

    ngAfterViewInit() {
        this.dataService.getCurrentGame()
        .subscribe(currentGame => {
            if (currentGame && currentGame.paths) {
                this.currentGame = this.checkers.getGame(currentGame);
                this.setState();
               
                if (this.currentGame && !this.gameViewComponent.isInit) { 
                    const range = this.getRange();
                    this.gameViewComponent.createGameView(this.currentGame, range); 
                }

                this.compareData({
                    score: this.dataService.getPlayers(),
                    playerId: this.authService.getUserId(),
                    hitsChips: this.currentGame.hitsChips,
                    players: this.currentGame.players
                });
                this.currentGame.setNextStep(this.getRange());
                this.gameViewComponent.updateCurrentGame(this.currentGame);
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
        let newQueen = (this.currentGame.newQueen) ? this.currentGame.newQueen.slice() : null;
        this.gameViewComponent.makeStep(step.from, step.to, ifOpponent)
        .then(() => {
            if (!ifOpponent) { 
                this.currentGame.postStepProcessor(step); 
                newQueen = (this.currentGame.newQueen) ? this.currentGame.newQueen.slice() : null;
            }
            this.setState();
           
            if (newQueen) {
                this.gameViewComponent.newQueen(newQueen);
            }

            if (this.currentGame.nextStep) {
                this.gameViewComponent.showNextStep();
            }
        });

        if (hitChips.length) {
            hitChips.forEach(h => {
                this.gameViewComponent.removeHits(h);
            })
        }
    }

    onStep(step) {
        let hitChips = this.currentGame.makeStep(step);

        if (hitChips === undefined) {
            this.gameViewComponent.cancelStep(step.from);
        } else {
            this.makeStep(hitChips, step);
            this.meetingsService.makeStep(step, hitChips, this.authService.getPlayerId());
        }
    }
}