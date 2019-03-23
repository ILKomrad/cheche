import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class MeetingsService {
    constructor(
        private httpService: HttpService,
        private authService: AuthService
    ) {}

    createMeeting(type) {
        const user = this.authService.getUser();
        console.log('createMeeting', type, user);
        this.httpService.sendMessage('createMeeting', {type, user});
    }

    selectMeeting(id) {
        console.log('selectMeeting', id);
        this.httpService.sendMessage('selectMeeting', {id});
    }
}