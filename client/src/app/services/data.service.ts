import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Meeting } from 'src/app/models/models';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    data$ = new BehaviorSubject<any>([]);
    currentGame$ = new BehaviorSubject<any>({});
    data;
    currentGame;
    currentMeetingId;
    currentMeeting;

    constructor() {
        this.data = [];
    }

    setData(data: Meeting[]) {
        this.data = data;
        this.data$.next(data);
    }

    addData(data: Meeting) {
        this.data.push(data);
        this.data = this.data.slice();
        this.data$.next(this.data);
    }

    setCurrentGame(currentGame) {
        console.log( 'setCurrentGame', currentGame );
        this.currentGame = currentGame;
        this.currentGame$.next(currentGame);
        // this.authService.setCurrentMeetingId(currentGame.id, data.game.id);
    }

    getCurrentGame() {
        return this.currentGame$;
    }

    isStart() {
        return true;
        if (this.currentGame && this.currentGame.players) {
            return this.currentGame.players.length === 2;
        } else {
            return false;
        }
    }

    getPlayers() {
        if (this.currentMeeting) {
            return this.currentMeeting.score;
        }
    }

    setCurrentMeeting(meeting, currentGame) {
        console.log( 'setCurrentMeeting', meeting, currentGame );
        this.currentMeeting = meeting;
        this.setCurrentGame(currentGame);

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