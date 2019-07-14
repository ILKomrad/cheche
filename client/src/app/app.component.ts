import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from './services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Meeting } from 'src/app/models/models';
import { MeetingsService } from 'src/app/services/meetings.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'client';
  init = false;

  constructor(
    private httpService: HttpService,
    private authService: AuthService,
    private dataService: DataService,
    private meetingService: MeetingsService,
    private router: Router,
    private soundService: SoundService
  ) {}

  ngOnInit() {
    if (!this.init) {
      this.init = true;
      this.soundService.startLoad();
      this.httpService.sendMessage('hello', {playerId: this.authService.getTocken()});

      this.httpService.listen('helloFromServer').subscribe((data: any) => {
        this.dataService.start();

        if (data.user === undefined) {
          this.authService.logout();
        } else {
          this.authService.setUser(data.user);
        }
        this.dataService.setData(data.mettings);
  
        if (!data.currentMeeting && !data.currentGame) {
          this.router.navigate(['/']);
        } else {
          this.dataService.setCurrentMeeting(data.currentMeeting, data.currentGame);
        }

        this.httpService.listen('currentMeeting')
        .subscribe((data: any) => {
          this.dataService.setCurrentMeeting(data.currentMeeting, data.currentGame);
        });

        this.httpService.listen('newMeeting')
        .subscribe((data: Meeting) => {
          this.dataService.addData(data);
        });

        this.httpService.listen('meetingCreated')
        .subscribe((data: any) => {
          if (!this.authService.bot) {this.dataService.addData(data.meeting);}
          this.dataService.setCurrentMeeting(data.meeting, data.game);
          this.router.navigate(['/game']);
          this.authService.inGame(data.meeting, data.game);
        });

        this.httpService.listen('removeMeeting')
        .subscribe((id: any) => {
          this.dataService.removeData(id);
          const currentMeetingId = this.dataService.getCurrentMeetingId();

          if (currentMeetingId === id) {
            this.dataService.setCurrentMeeting(null, null);
            this.authService.leaveMeeting();
          }
        });

        this.httpService.listen('meetingFinish')
        .subscribe(() => {
          this.dataService.setCurrentMeeting(null, null);
          this.authService.leaveMeeting();
        });

        this.httpService.listen('startMeeting')
        .subscribe((data: any) => {
          this.dataService.setCurrentMeeting(data, data.currentGame);
          this.router.navigate(['/game']);
          this.authService.inGame(data.id, data.currentGame.id);
        });

        this.httpService.listen('makeStep')
        .subscribe((data: any) => {
          this.dataService.setCurrentGame(data); // if you made step and go to the list
          this.meetingService.opponentStep(data.whoWin);
        });

        this.httpService.listen('opponentStep')
        .subscribe((data: any) => {
          this.meetingService.opponentStep(data.steps);
          this.dataService.setCurrentGame(data.game);
        });

        this.httpService.listen('continueGame')
        .subscribe((data: any) => {
          this.dataService.setCurrentMeeting(data.currentMeeting, data.currentGame);
          this.router.navigate(['/game']);
        });
      });
    }
  }

  ngAfterViewInit() {
    
  }
}
