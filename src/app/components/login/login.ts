import { Component } from '@angular/core';
import { GoogleLogin } from './google-login/google-login';
import { FacebookLogin } from './facebook-login/facebook-login';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { IUser } from '../../Interface/IUser';

@Component({
  selector: 'app-login',
  imports: [GoogleLogin, FacebookLogin, FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  log: Boolean = false;
  pressed: boolean = false;
  users: IUser[] = [];
  constructor(private myService: AuthService, private router: Router) { }
  ngOnInit() {
    this.myService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (error) => console.log('filed to get users', error),
    });
  }
  get formValid() {
    return this.logForm.invalid;
  }
  logForm = new FormGroup({
    userormail: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
  });

  login(email: string, password: string, rememberMe: boolean) {
    if (this.logForm.valid) {
      this.pressed = true;
      for (let user of this.users) {
        if ((user.email == email || user.username == email) && user.password == password && user.loginMethod == 'email') {
          this.log = true;
          this.myService.setUserToken(user, rememberMe);
          if (user.role === 'admin')
            this.router.navigate(['/Dashboard']);
          else
            this.router.navigate(['/MainHome']);
          return;
        }
      }
    }


    if (this.log) {
      console.log('login successful');
    } else {
      console.log('login failed');
    }
  }
}
