import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class MeetingsService {
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
}