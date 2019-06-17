import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'game-interface',
    styleUrls: ['./game-interface.component.scss'],
    templateUrl: './game-interface.component.html'
})
export class GameInterfaceComponent {
    isWarnOpen = false;
    warnMessage = '';
    state = '';
    @Input() data;
    @Input() soundState;
    @Output() newGame = new EventEmitter<any>();
    @Output() onSoundSwitch = new EventEmitter<any>();

    ngOnChanges() {
        // console.log( 'GameInterfaceComponent', this.data );
    }

    warnOpen(event) {
        this.isWarnOpen = true;

        switch (event) {
            case 'newGame':
                this.state = 'waitForNewGame';
                this.warnMessage = 'do you want to give up, and start new game?';
                break;
        }
    }

    confirmation(flag) {
        switch (this.state) {
            case 'waitForNewGame':
                if (flag === 'yes') {
                    this.newGame.emit();
                }
                break;
        }

        this.isWarnOpen = false;
        this.state = 'idle'; 
    }

    soundSwitch() {
        this.onSoundSwitch.emit();
    }
}