import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MeetingsService } from './services/meetings.service';

@Component({
    templateUrl: './meetings.component.html'
})
export class MeetingsComponent {
    meetings;
    isLogin = null;
    userId = null;
    currentMeetingId = null;
    authState;

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private meetingsService: MeetingsService
    ) {}

    ngOnInit() {
        this.authService.isLoggedIn.subscribe(token => {
            if (token !== null) {
                this.isLogin = token;
            }
            const user = this.authService.getUser();
            this.userId = user.id;
            this.currentMeetingId = user.currentMeetingId;
            this.authState = this.authService.getState();
        })

        this.dataService.getData().subscribe(data => {
            this.meetings = data;
        });
    }

    createMeeting(meetingType) {
        if ((this.authState === 'isLogin') && (this.currentMeetingId === null)) {
            const user = this.authService.getUser();
            this.meetingsService.createMeeting(meetingType, user);
            this.authState = 'waiting';
        }
    }

    leaveMeeting() {
        const user = this.authService.getUser();
        this.meetingsService.removeMeeting(user.playerId);
        this.authService.leaveMeeting();
    }

    selectMeeting(meetingId) {
        const user = this.authService.getUser();
        this.meetingsService.selectMeeting(user.playerId, meetingId);
    }
}