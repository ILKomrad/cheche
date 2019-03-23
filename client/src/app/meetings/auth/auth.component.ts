import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    authForm: FormGroup;
    formTitle = 'Войти';
    toggleTitle = 'Регистрация';
    state = 'login';
    buttonLabel = 'Войти';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.authForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            category: '',
            name: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.state === 'login') {
            this.login();
        } else {
            this.checkIn();
        }
    }

    authToggle() {
        if (this.state === 'login') {
            this.state = 'checkIn';
            this.formTitle = 'Регистрация';
            this.toggleTitle = 'Войти';
            this.buttonLabel = 'Зарегестрироваться';
        } else {
            this.state = 'login';
            this.formTitle = 'Войти';
            this.toggleTitle = 'Регистрация';
            this.buttonLabel = 'Войти';
        }
    }

    login() {
        const email = this.authForm.get('email').value,
            password = this.authForm.get('password').value;
        
        this.authService.login(email, password);
    }

    checkIn() {
        const user = {};
        user['email'] = this.authForm.get('email').value;
        user['password'] = this.authForm.get('password').value;
        user['category'] = this.authForm.get('category').value;
        user['name'] = this.authForm.get('name').value;
        
        this.authService.checkIn(user)
        .then(data => {
            console.log(data);
        })
    }
}