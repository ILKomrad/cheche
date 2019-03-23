import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GameComponent } from 'src/app/game/game.component';

@NgModule({
    declarations: [
        GameComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: GameComponent
            }
        ])
    ]
})
export class GameModule {

}