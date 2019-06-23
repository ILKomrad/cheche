import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'user-room',
    templateUrl: './user-room.component.html',
    styleUrls: ['./user-room.component.scss']
})
export class UserRoomComponent {
    isOpen = false;
    user;
    @Output() logout = new EventEmitter<any>();

    constructor(
        private authService: AuthService
    ) {
        this.toggle = this.toggle.bind(this);
    }

    toggle(e) {
        e.stopPropagation();

        if (!this.isOpen) {
            window.addEventListener('click', this.toggle);
        } else {
            window.removeEventListener('click', this.toggle);
        }
        this.isOpen = !this.isOpen;
    }

    onLogout() {
        this.logout.emit();
    }

    ngOnInit() {
        this.user = this.authService.getUser();
    }
}