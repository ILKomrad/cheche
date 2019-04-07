import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { GameComponent } from 'src/app/game/game.component';
import { GameViewComponent } from 'src/app/game/game-view.component';
import { GameInterfaceComponent } from './game-interface/game-interface.component';
import { GameOverComponent } from 'src/app/game/game-over/game-over.component';

@NgModule({
    declarations: [
        GameComponent,
        GameViewComponent,
        GameInterfaceComponent,
        GameOverComponent
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