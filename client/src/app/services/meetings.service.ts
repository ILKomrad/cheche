import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Observable, of, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MeetingsService {
    step$ = new BehaviorSubject<any>({});
    
    constructor(
        private httpService: HttpService
    ) {}

    createMeeting(type, user) {
        this.httpService.sendMessage('createMeeting', {type, user});
    }

    selectMeeting(token, meetingId) {
        console.log( 'selectMeeting', token, meetingId );
        this.httpService.sendMessage('selectMeeting', {playerId: token, meetingId: meetingId});
    }

    removeMeeting(tokenId) {
        this.httpService.sendMessage('removeMeeting', {tokenId});
    }

    makeStep(steps, token) {
        this.httpService.sendMessage('makeStep', {steps, token});
        // window.dispatchEvent(new CustomEvent('makeStep', {detail: {steps, token}}));
    }

    continueMeeting(token) {
        this.httpService.sendMessage('continueGame', {token});
    }

    stepHandler() {
        return this.step$;
    }

    opponentStep(steps) {
        this.step$.next({steps});
    }
}