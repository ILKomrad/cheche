import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { HttpService } from 'src/app/services/http.service';
import { User } from 'src/app/models/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn = new BehaviorSubject<any>(null);
    user: User = new User();
    state = 'guest';

    constructor(
        private httpService: HttpService
    ) {}

    login(email, password) {
        this.httpService.sendMessage('login', {email, password}); 

        this.httpService.listenPromise('loginResult')
        .then((data: any) => {
            if (data && data.playerId) {
                this.setUser(data);
            } else {
                this.logout();
            }
        });
    }

    logout() {
        console.warn('logout');
        localStorage.removeItem('checkers_playerId');

        if (this.user && this.user.id) {
            this.httpService.sendMessage('logout', {id: this.user.id}); 
            this.setUser(new User());
        } 
        this.isLoggedIn.next(false);      
    }

    checkIn(user) {
        this.httpService.sendMessage('checkIn', user); 

        return this.httpService.listenPromise('checkInResult');
    }

    setUser(user: User) {
        console.warn('setUser', user);
        this.user = user;
        this.setState();
        this.isLoggedIn.next(user.playerId);
        localStorage.setItem('checkers_playerId', user.playerId + '');
    }

    leaveMeeting() {
        this.user.currentMeetingId = null;
        this.user.inGame = null;
        this.setUser(this.user);
    }

    inGame(meetingId, gameId = null) {
        this.user.inGame = gameId;
        this.user.currentMeetingId = meetingId;
        this.setUser(this.user);
    }

    setState() {
        if (this.user.currentMeetingId !== null) {
            this.state = 'inGame';
        } else if (this.user.id !== null) {
            this.state = 'isLogin';
        } else {
            this.state = 'guest';
        }
        console.log('state', this.state);
    }

    getCurrentMeetingId() {
        return this.user.currentMeetingId;
    }

    getUserId() {
        return this.user.id;
    }

    getState() {
        return this.state;
    }

    getUser(): User {
        return this.user;
    }

    getPlayerId() {
        return this.user.playerId;
    }

    getTocken() {
        return localStorage.getItem('checkers_playerId');
    }
}