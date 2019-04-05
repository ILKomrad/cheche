import { Component, Input } from '@angular/core';

@Component({
    selector: 'game-interface',
    styleUrls: ['./game-interface.component.scss'],
    templateUrl: './game-interface.component.html'
})
export class GameInterfaceComponent {
    @Input() data;

    ngOnChanges() {
        console.log( this.data );
    }
}