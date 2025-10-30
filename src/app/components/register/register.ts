import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';
import { GoogleLogin } from '../login/google-login/google-login';
import { FacebookLogin } from '../login/facebook-login/facebook-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, GoogleLogin, FacebookLogin, CommonModule],
  templateUrl: './register.html',
  styleUrl: 'register.css',
})
export class Register {
  uniqueValidator(existingValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && existingValues.includes(value)) {
        return { unique: true };
      }
      return null;
    };
  }

  hasLowerCase = /[a-z]/;
  hasNumeric = /[0-9]/;
  hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  hasUpperCase = /[A-Z]/;

  users: IUser[] = [];
  usernames: string[] = [];
  email: string[] = [];
  regForm = new FormGroup({
    firstName: new FormControl("", [Validators.minLength(4), Validators.required]),
    lastName: new FormControl("", [Validators.minLength(4), Validators.required]),
    userName: new FormControl("", [
      Validators.minLength(4),
      Validators.required,
      this.uniqueValidator(this.usernames),
    ]),
    email: new FormControl("", [
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
      Validators.required,
      this.uniqueValidator(this.email),
    ]),
    dateOfBirth: new FormControl("", Validators.required),
    gender: new FormControl("", Validators.required),
    phone: new FormControl(""),
    password: new FormControl<string | null>("", [
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/
      ),
      Validators.required,
    ]),
    cpassword: new FormControl("", Validators.required),
  });
  constructor(private myService: AuthService, private router: Router) { }
  ngOnInit() {
    this.myService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        for (let user of this.users) {
          this.usernames.push(user.username);
          this.email.push(user.email);
          console.log('Users:', this.usernames);
        }
        console.log('Usernames count:', this.usernames.length);
      },
      error: (error) => console.log('filed to get users', error),
    });
    console.log(this.regForm);
  }
  get formValid() {
    return this.regForm.valid;
  }

  getUserData() {
    if (this.regForm.valid) {
      const user = {
        id: this.myService.getNextId(this.users),
        firstName: this.regForm.value.firstName?.trim(),
        lastName: this.regForm.value.lastName?.trim(),
        username: this.regForm.value.userName?.trim(),
        email: this.regForm.value.email?.trim(),
        password: this.regForm.value.password?.trim(),
        dateOfBirth: this.regForm.value.dateOfBirth,
        gender: this.regForm.value.gender,
        phone: this.regForm.value.phone,
        createdAt: new Date(),
        loginMethod: 'email',
        isActive: true,
        role: 'user'
      } as IUser
      this.myService.postUserData(user)
        .subscribe({
          next: (response) => {
            console.log(' User created', response);
            this.myService.setUserToken(response);
            this.router.navigate(['/MainHome']);
          },
          error: (err) => console.error(' Error:createtion', err),
        });
    }
  }
}
