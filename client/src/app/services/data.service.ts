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
    currentMeeting;

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

    setCurrentMeeting(meeting, currentGame) {
        console.log( 'setCurrentMeeting', meeting );
        this.setCurrentGame(currentGame);
        this.currentMeeting = meeting;

        if (meeting) { 
            this.currentMeetingId = meeting.id; 
        } else {
            this.currentMeetingId = null;
        }
    }

    getCurrentMeetingId() {
        return this.currentMeetingId;
    }

    getCurrentMeeting() {
        return this.currentMeeting;
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