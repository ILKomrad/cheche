import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.scss']
})
export class UserAreaComponent implements OnInit {
  user;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(token => {
      if (token !== null) {
        if (token) {
          this.user = this.authService.getUser();
        } else {
          this.user = null;
        }
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
