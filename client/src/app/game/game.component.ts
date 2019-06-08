import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { Checkers, StepGenerator } from './checkers/checkers';
import { GameViewComponent } from 'src/app/game/game-view.component';
import { MeetingsService } from 'src/app/services/meetings.service';
import { AuthService } from 'src/app/services/auth.service';
import { SoundService } from 'src/app/services/sound.service';
import { StepGeneratorService } from 'src/app/game/step-generator.service';


@Component({
    templateUrl: './game.component.html'
})
export class GameComponent {
    currentGame;
    checkers;
    isStart = false;
    interfaceData = [];
    isGameOver = false;
    steps = [];
    state = {alias: 'waiting', additional: null};
    gameStart = false;
    isRestart = false;
    meetingsService$;
    dataService$;

    @ViewChild(GameViewComponent)
    private gameViewComponent: GameViewComponent;

    constructor(
        private dataService: DataService,
        private meetingsService: MeetingsService,
        private authService: AuthService,
        private soundService: SoundService,
        private stepGeneratorService: StepGeneratorService,
    ) {
        this.checkers = Checkers;
    }

    setState() {
        if (this.dataService.isStart() || this.authService.bot) {
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

    ngOnInit() {
        this.dataService$ = this.dataService.getCurrentGame()
        .subscribe(currentGame => {
            if (currentGame && currentGame.paths) {
                this.currentGame = this.checkers.getGame(currentGame);
                const range = this.getRange();
             
                if (this.currentGame && !this.gameViewComponent.isInit) { 
                    this.gameViewComponent.createGameView(this.currentGame, range); 
                }
              
                if (!this.isStart && this.dataService.isStart()) {
                    this.setState();
                    this.isStart = true;
                }

                if (this.isRestart) {
                    this.gameViewComponent.restartGameView(this.currentGame, range); 
                    this.isRestart = false;
                }
                
                this.updateInterface();
                // this.currentGame.setNextStep();
                this.gameViewComponent.updateCurrentGame(this.currentGame);
            }
        });

        this.meetingsService$ = this.meetingsService.stepHandler().subscribe(async(steps) => {
            console.log('sub', steps.steps)
            if (steps.steps) {
                this.stepHandler(steps.steps);
            }
        })
    }

    ngOnDestroy() {
        this.meetingsService$.unsubscribe();
        this.dataService$.unsubscribe();
      }

    updateInterface() {
        this.compareData({
            score: this.dataService.getPlayers(),
            playerId: this.authService.getUserId(),
            hitsChips: this.currentGame.hitsChips,
            players: this.currentGame.players,
            whosTurn: this.currentGame.whosTurn,
            maxHits: this.currentGame.maxHits
        });
    }

    getRange() {
        const userId = this.authService.bot ? 'you' : this.authService.getUserId();
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
                turn: (player.range === data.whosTurn),
                maxHits: data.maxHits
            })
        })
        this.interfaceData = d;
    }

    async postStep(ifOpponent, step, multiStep = false) {
        let newQueen = (this.currentGame.newQueen) ? this.currentGame.newQueen.slice() : null;
        
        if (newQueen && ((step.to[0] !== newQueen[0]) || (step.to[1] !== newQueen[1]))) {
            newQueen = null;
        }
  
        if (!multiStep) { this.updateInterface(); }
       
        if (newQueen) {
            this.soundService.reproduceSound('queen');
            await this.gameViewComponent.newQueen(newQueen);
            this.currentGame.newQueen = null;
        }

        if (!multiStep && this.currentGame.nextStep) {
            this.gameViewComponent.showNextStep();
        }

        if (!multiStep) { this.setState(); }
    }

    async makeStep(hitChips, step, ifOpponent = false, multiStep = false) {
        this.gameViewComponent.startRender();
        await this.gameViewComponent.makeStep(step.from, step.to, ifOpponent);
        this.soundService.reproduceSound('step');
        
        await this.postStep(ifOpponent, step, multiStep);

        if (hitChips.length) {
            this.soundService.reproduceSound('remove');
            await this.gameViewComponent.removeHits(hitChips);
        }
        this.gameViewComponent.stopRender();
    }

    async stepHandler(steps) {
        let i = 0;
       
        while (i < steps.length) {
            let step = steps[i];

            if (step.step) {
                if (i === steps.length - 1) {
                    await this.makeStep(step.hitChips, step.step, true);
                } else {
                    await this.makeStep(step.hitChips, step.step, true, true);
                }
            }

            i++;
        }
    }

    async onStep(step) {
        let hitChips = this.currentGame.makeStep(step);
        
        if (hitChips === undefined) {
            this.gameViewComponent.cancelStep(step.from);
        } else {
            await this.makeStep(hitChips, step);
            this.steps.push({step, hitChips});
           
            if (!this.currentGame.nextStep || (this.currentGame.nextStep.length === 0)) {
                if (!this.authService.bot) {
                    this.meetingsService.makeStep(this.steps.slice(), this.authService.getPlayerId()); 
                } else {
                    if (!this.currentGame.whoWin) {
                        setTimeout(() => {
                            let gen = new StepGenerator();
                            gen.init(this.currentGame);
                            let data = gen.getStep();
                            data.steps.forEach(step => {
                                this.currentGame.makeStep(step.step, data.steps.length);
                            });
                            this.currentGame.setNextStep();
                            this.meetingsService.opponentStep(data.steps);   
                            this.steps = [];    
                            gen = null;
                        }, 500);
                    }
                }
        
                this.steps = [];
            }
        }
    }

    newGame() {
        this.isStart = false;
        this.isRestart = true;
        this.meetingsService.newGame(this.authService.getPlayerId());
    }

    onGameStart() {
        this.gameStart = true;
    }
}