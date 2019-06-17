import { Component, Input } from '@angular/core';

@Component({
    selector: 'game-over',
    templateUrl: './game-over.component.html',
    styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent {
    @Input() result;
    @Input() meetingFinish;
}