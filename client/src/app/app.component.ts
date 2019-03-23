import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from './services/http.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { Meeting } from 'src/app/models/models';

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
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.init) {
      this.init = true;

      this.httpService.sendMessage('hello', {playerId: this.authService.getTocken()});

      this.httpService.listen('helloFromServer').subscribe((data: any) => {
        if (data.user === undefined) {
          this.authService.logout();
        } else {
          this.authService.setUser(data.user);
        }

        this.dataService.setData(data.mettings);

        this.httpService.listen('newMeeting')
        .subscribe((data: Meeting) => {
          this.dataService.addData(data);
        });

        this.httpService.listen('meetingCreated')
        .subscribe((data: any) => {
          this.dataService.addData(data.meeting, data.game);
          this.authService.setCurrentMeetingId(data.meeting.id, data.game.id);
          // this.router.navigate(['/game']);
        });

        this.httpService.listen('removeMeeting')
        .subscribe((id: any) => {
          const currentMeetinId = this.authService.getCurrentMeetingId();
          console.log( currentMeetinId, id );

          if (currentMeetinId !== id) {
            this.dataService.removeData(id);
          }
        });

        this.httpService.listen('startMeeting')
        .subscribe((data: any) => {
          console.log( data )
        });
      });
    }
  }

  ngAfterViewInit() {
    
  }
}
