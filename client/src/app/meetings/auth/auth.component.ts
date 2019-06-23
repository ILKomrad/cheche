import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    checkInForm: FormGroup;
    loginForm: FormGroup;
    formTitle = 'Войти';
    toggleTitle = 'Регистрация';
    state = 'login';
    buttonLabel = 'Войти';
    authError: any = '';
    wait = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.checkInForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
            category: '',
            name: ['']
        });
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        })
    }

    authToggle() {
        this.authError = '';
        this.loginForm.reset();
        this.checkInForm.reset();

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
        const email = this.loginForm.get('email').value,
            password = this.loginForm.get('password').value;

        if (!email || !password) {return;}
        this.wait = true;
        this.authService.login(email, password).then(result => {
            if (!result) {
                this.authError = 'auth error';
                this.state = 'login';
                this.wait = false;
            }
        })
    }

    checkIn() {
        const user = {};
        user['email'] = this.checkInForm.get('email').value;
        user['password'] = this.checkInForm.get('password').value;
        user['category'] = this.checkInForm.get('category').value;
        user['name'] = this.checkInForm.get('name').value;
        
        if (this.checkInForm.valid) {
            this.wait = true;
            this.authService.checkIn(user)
            .then(data => {
                if (!data || data === 'email is busy') {
                    this.authError = data;
                    this.wait = false;
                } else if (data) {
                    this.authToggle();
                    this.wait = false;
                    this.authError = 'registration completed successfully';
                }
            })
        }
    }
}