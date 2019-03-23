import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Meeting } from 'src/app/models/models';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    data$ = new BehaviorSubject<any>([]);
    data;

    constructor() {
        this.data = [];
    }

    setData(data: Meeting[]) {
        console.warn('setData', data);
        this.data = data;
        this.data$.next(data);
    }

    addData(data: Meeting, currentGame = null) {
        if (currentGame) { data.currentGame = currentGame; }
        this.data.push(data);
        this.data = this.data.slice();
        this.data$.next(this.data);
        console.log('addData', this.data);
    }

    setCurrentMeeting(currentGame) {
        this.data.currentGame = currentGame;
        this.data$.next(this.data);
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