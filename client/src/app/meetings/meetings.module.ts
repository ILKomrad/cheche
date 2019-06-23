import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MeetingsComponent } from './meetings.component';
import { AuthComponent } from './auth/auth.component';
import { MeetingListComponent } from './meeting-list/meeting-list.component';
import { MeetingGeneratorComponent } from './meeting-generator/meeting-generator.component';
import { MeetingsPipe } from 'src/app/meetings/meeting.pipe';
import { UserRoomComponent } from 'src/app/meetings/user-room/user-room.component';
import { AlertModule } from 'src/app/components/alert/alert.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild([
            {
                path: '',
                component: MeetingsComponent
            }
        ]),
        AlertModule
    ],
    declarations: [
        MeetingsComponent,
        AuthComponent,
        MeetingListComponent,
        MeetingGeneratorComponent,
        MeetingsPipe,
        UserRoomComponent,
    ]
})
export class MeetingsModule {

}