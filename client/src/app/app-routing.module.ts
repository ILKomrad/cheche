import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'meetingList',
    pathMatch: 'full'
  },
  {
    path: 'meetingList',
    loadChildren: './meetings/meetings.module#MeetingsModule'
  },
  {
    path: 'game',
    loadChildren: './game/game.module#GameModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
