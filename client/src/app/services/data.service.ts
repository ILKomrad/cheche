import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Meeting } from 'src/app/models/models';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    data$ = new BehaviorSubject<any>([]);
    data;
    currentGame;
    currentMeetingId;

    constructor() {
        this.data = [];
    }

    setData(data: Meeting[]) {
        console.warn('setData', data);
        this.data = data;
        this.data$.next(data);
    }

    addData(data: Meeting) {
        this.data.push(data);
        this.data = this.data.slice();
        this.data$.next(this.data);
        console.log('addData', this.data);
    }

    setCurrentGame(currentGame) {
        console.log( 'setCurrentGame', currentGame );
        this.currentGame = currentGame;
        // this.authService.setCurrentMeetingId(currentGame.id, data.game.id);
    }

    setCurrentMeeting(meetingId, currentGame) {
        console.log( 'setCurrentMeeting', meetingId );
        this.setCurrentGame(currentGame);
        this.currentMeetingId = meetingId;
    }

    getCurrentMeetingId() {
        return this.currentMeetingId;
    }

    getCurrentMeeting() {
        let meeting;

        this.data.forEach(element => {
            if (element.id === this.currentMeetingId) {
                meeting = element;
            }
        });
        return meeting;
    }

    getData(): BehaviorSubject<any> {
        return this.data$;
    }

    removeData(id) {
        this.data = this.data.filter(meeting => meeting.id !== id);
        this.data$.next(this.data);
        console.log('removeData', this.data);
    }
}