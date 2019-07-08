import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { MeetingsService } from '../services/meetings.service';

@Component({
    templateUrl: './meetings.component.html',
    styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent {
    meetings;
    isLogin = null;
    userId = null;
    currentMeetingId = null;
    authState;
    init;
    alertMessage = '';
    selectedMeeting = null;
    alertShow = false;

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        private meetingsService: MeetingsService,
        private router: Router
    ) {}

    ngOnInit() {
        this.authService.isLoggedIn.subscribe(token => {
            if (token !== null) {
                this.isLogin = token;
            }
            
            this.userId = this.authService.getUserId();
            this.currentMeetingId = this.authService.getCurrentMeetingId();
            this.authState = this.authService.getState();
            console.log( this.authState, this.authService.getCurrentMeetingId() )
        })

        this.dataService.getData().subscribe(data => {
            this.meetings = data;

            this.init = this.dataService.isInit();
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

    selectMeeting(meeting) {
        const meetingId = meeting.id;

        if (this.selectedMeeting === null) { 
            this.selectedMeeting = meetingId; 
        } else {
            return;
        }

        if (this.isLogin || meetingId === 'robot') {
            this.meetingsService.setBotLevel(meeting.botLevel);
            this.meetingsService.selectMeeting(this.authService.getTocken(), meetingId);
        } else {
            this.alertMessage = 'You must log in to play with other users';
            this.alertShow = true;
        }
    }

    closeMessage() {
        this.alertShow = false;
    }

    continueGame() {
        if (this.dataService.getCurrentMeeting() !== undefined) {
            this.router.navigate(['/game']);
        }
    }

    onLogout() {
        this.authService.logout();
    }
}