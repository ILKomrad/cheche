import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { Checkers } from './checkers/checkers';
import { GameViewComponent } from 'src/app/game/game-view.component';
import { MeetingsService } from 'src/app/services/meetings.service';
import { AuthService } from 'src/app/services/auth.service';
import { SoundService } from 'src/app/services/sound.service';


@Component({
    templateUrl: './game.component.html'
})
export class GameComponent {
    currentGame;
    checkers;
    isStart = false;
    interfaceData;
    isGameOver = false;
    steps = [];
    state = {alias: 'waiting', additional: null};

    @ViewChild(GameViewComponent)
    private gameViewComponent: GameViewComponent;

    constructor(
        private dataService: DataService,
        private meetingsService: MeetingsService,
        private authService: AuthService,
        private soundService: SoundService
    ) {
        this.checkers = Checkers;
    }

    setState() {
        console.warn('setSt');
        if (this.dataService.isStart()) {
            this.state = {alias: 'start', additional: null};
        } else {
            this.state = {alias: 'waiting', additional: null};
        }

        if (this.currentGame && this.currentGame.whoWin) {
            this.state = {alias: 'gameOver', additional: this.currentGame.whoWin};
          
            if (this.getRange() === this.currentGame.whoWin) {
                this.soundService.reproduceSound('win');
            } else {
                this.soundService.reproduceSound('loose');
            }
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
                this.updateInterface();
                this.currentGame.setNextStep(this.getRange());
                this.gameViewComponent.updateCurrentGame(this.currentGame);
            }
        });

        this.meetingsService.stepHandler().subscribe(async(step) => {
            if (step.step) {
                await this.makeStep(step.hitChips, step.step, true);
            }
        })
    }

    updateInterface() {
        this.compareData({
            score: this.dataService.getPlayers(),
            playerId: this.authService.getUserId(),
            hitsChips: this.currentGame.hitsChips,
            players: this.currentGame.players,
            whosTurn: this.currentGame.whosTurn
        });
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
                score,
                turn: (player.range === data.whosTurn)
            })
        })
        this.interfaceData = d;
    }

    async postStep(ifOpponent, newQueen, step) {
        if (!ifOpponent) { 
            newQueen = (this.currentGame.newQueen) ? this.currentGame.newQueen.slice() : null;
        }

        // this.setState();

        this.updateInterface();
       
        if (newQueen) {
            this.soundService.reproduceSound('queen');
            await this.gameViewComponent.newQueen(newQueen);
        }

        if (this.currentGame.nextStep) {
            this.gameViewComponent.showNextStep();
        }
    }

    async makeStep(hitChips, step, ifOpponent = false) {
        this.gameViewComponent.startRender();
        let newQueen = (this.currentGame.newQueen) ? this.currentGame.newQueen.slice() : null;
        await this.gameViewComponent.makeStep(step.from, step.to, ifOpponent);
        this.soundService.reproduceSound('step');
        await this.postStep(ifOpponent, newQueen, step);

        if (hitChips.length) {
            this.soundService.reproduceSound('remove');
            await this.gameViewComponent.removeHits(hitChips);
        }
        this.gameViewComponent.stopRender();
        console.log('remove');
    }

    onStep(step) {
        let hitChips = this.currentGame.makeStep(step);
        this.currentGame.postStepProcessor(step, this.getRange()); 

        if (hitChips === undefined) {
            this.gameViewComponent.cancelStep(step.from);
        } else {
            this.makeStep(hitChips, step);
            this.steps.push({step, hitChips});
           
            if (!this.currentGame.nextStep || (this.currentGame.nextStep.length === 0)) {
                console.log( 'send', this.steps )
                // this.meetingsService.makeStep(step, hitChips, this.authService.getPlayerId());
            }
        }
    }
}