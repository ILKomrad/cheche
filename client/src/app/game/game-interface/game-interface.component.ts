import { Component, Input } from '@angular/core';

@Component({
    selector: 'game-interface',
    styleUrls: ['./game-interface.component.scss'],
    templateUrl: './game-interface.component.html'
})
export class GameInterfaceComponent {
    isWarnOpen = false;
    warnMessage = '';
    @Input() data;

    ngOnChanges() {
        // console.log( 'GameInterfaceComponent', this.data );
    }

    warnOpen(event) {
        this.isWarnOpen = true;

        switch (event) {
            case 'newGame':
                this.warnMessage = 'do you want to give up, and start new game?';
                break;
        }
    }
}