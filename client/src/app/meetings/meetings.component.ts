import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MeetingsService } from '../services/meetings.service';

@Component({
    templateUrl: './meetings.component.html',
    styles: [`
        :host {
            display: block;
            padding: 20vmin 4vmin 4vmin 4vmin;
        }
    `]
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
    
            this.userId = this.authService.getUserId();
            this.currentMeetingId = this.authService.getCurrentMeetingId();
            this.authState = this.authService.getState();
        })

        this.dataService.getData().subscribe(data => {
            this.meetings = data;
        });
    }

    createMeeting(meetingType) {
        if ((this.authState === 'isLogin') && (this.currentMeetingId === null)) {
            this.meetingsService.createMeeting(meetingType, this.authService.getUser());
            this.authState = 'waiting';
        }
    }

    leaveMeeting() {
        this.meetingsService.removeMeeting(this.authService.getTocken());
        this.authService.leaveMeeting();
    }

    selectMeeting(meetingId) {
        this.meetingsService.selectMeeting(this.authService.getTocken(), meetingId);
    }

    continueGame() {
        if (this.dataService.getCurrentMeeting() === undefined) {
            this.meetingsService.continueMeeting(this.authService.getTocken());
        }
    }
}