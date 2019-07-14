import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

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
    isBot;
    soundState;

    @ViewChild(GameViewComponent)
    private gameViewComponent: GameViewComponent;

    constructor(
        private dataService: DataService,
        private meetingsService: MeetingsService,
        private authService: AuthService,
        private soundService: SoundService,
        private stepGeneratorService: StepGeneratorService,
        private router: Router
    ) {
        this.checkers = Checkers;
    }

    setState() {
        if (this.dataService.isStart() || this.currentGame.bot) {
            this.state = {alias: 'start', additional: null};
        } else {
            this.state = {alias: 'waiting', additional: null};
        }

        if (this.currentGame && this.currentGame.whoWin) {
            this.state = {alias: 'gameOver', additional: this.currentGame.whoWin};
        }
       
        if (this.currentGame.whosTurn !== this.getRange() && !this.currentGame.whoWin) {
            this.state = {alias: 'waiting', additional: null};
        }

        if (this.currentGame.whoWin) { 
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

                if (this.currentGame.bot) { 
                    this.isBot = true; 
                }

                if (!this.currentGame.nextStep) { this.currentGame.setNextStep(); }
                const range = this.getRange();
                
                if (this.currentGame && !this.gameViewComponent.isInit) { //init or continue
                    this.gameViewComponent.createGameView(this.currentGame, range); 
                } else {
                    this.gameViewComponent.updateCurrentGame(this.currentGame);
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
            } else if (this.isStart && !this.dataService.getCurrentMeeting()) { // opponent leave meeting
                this.gameViewComponent.opponentDisconect();
            }
        });
        this.meetingsService.removeSteps();
        this.meetingsService$ = this.meetingsService.stepHandler().subscribe(async(data) => {
            if (this.currentGame && this.currentGame.whoWin && data.steps !== 'w' && data.steps !== 'b') { return; } // Opponent took a step before you clicked a new game
            
            if (data.steps && data.steps !== 'w' && data.steps !== 'b' && !data.steps.whoWin) { //opponents step
                this.stepHandler(data.steps);
            } else if (data.steps && data.steps.whoWin) { // opponent push NewGame
                this.currentGame = this.checkers.getGame(data.steps);
            }
            
            if (this.currentGame && this.currentGame.whoWin) { this.setState(); }
        });
        this.soundService.getState().subscribe(state => {
            this.soundState = state;
        });
    }

    onSoundSwitch() {
        this.soundService.soundToggle();
    }

    ngOnDestroy() {
        this.meetingsService$.unsubscribe();
        this.dataService$.unsubscribe();
        this.meetingsService.removeSteps()
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
        const userId = this.currentGame.bot ? 'you' : this.authService.getUserId();
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

        if (!multiStep && ifOpponent) { this.setState(); }
    }

    async makeStep(hitChips, step, ifOpponent = false, multiStep = false) {
        this.gameViewComponent.startRender();
        await this.gameViewComponent.makeStep(step.from, step.to, ifOpponent);
        this.soundService.reproduceSound('step');        
        await this.postStep(ifOpponent, step, multiStep);
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

        await this.gameViewComponent.removeAllHits(steps);
    }

    async onStep(step) {
        let hitChips = this.currentGame.makeStep(step);

        if (hitChips === undefined) {
            this.gameViewComponent.cancelStep(step.from);
        } else {
            await this.makeStep(hitChips, step);
            this.steps.push({step, hitChips});
           
            if (!this.currentGame.nextStep || (this.currentGame.nextStep.length === 0)) {
                if (!this.currentGame.bot) {
                    this.gameViewComponent.removeAllHits(this.steps);
                    this.meetingsService.makeStep(this.steps.slice(), this.authService.getPlayerId()); 
                } else {
                    await this.gameViewComponent.removeAllHits(this.steps);
                   
                    if (!this.currentGame.whoWin) {
                        setTimeout(() => {
                            let gen = new StepGenerator(this.meetingsService.getBotLevel());
                            gen.init(this.currentGame);
                            let data = gen.getStep();
                            data.steps.forEach(step => {
                                this.currentGame.makeStep(step.step, data.steps.length);
                            });
                            this.currentGame.setNextStep();
                            this.dataService.setCurrentGame(this.currentGame);
                            this.meetingsService.opponentStep(data.steps);   
                            this.steps = [];    
                            gen = null;
                        }, 500);
                    } else {
                        this.setState();
                    }
                }
        
                this.steps = [];
            }
        }
    }

    newGame() {
        this.meetingsService.newGame(this.authService.getPlayerId());
        this.isStart = false;
        this.isRestart = true;
        this.isGameOver = false;
    }

    finishGame() {
        this.isStart = false;
        this.isRestart = true;
        this.meetingsService.finishGame(this.authService.getPlayerId());
    }

    onGameStart() {
        this.gameStart = true;
    }

    leaveGame() {
        this.authService.inGame(null, null);
        this.router.navigate(['/']);
    }
}