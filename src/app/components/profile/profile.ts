import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  user!: IUser;
  Users: IUser[] = [];
  showPasswordFields = false;
  hasLowerCase = /[a-z]/;
  hasNumeric = /[0-9]/;
  hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  hasUpperCase = /[A-Z]/;


  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    debugger
    const data = this.authService.getUserbyToken();
    if (data) {
      this.user = data;
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        username: this.user.username,
        dateOfBirth: this.user.dateOfBirth,
        gender: this.user.gender,
        phone: this.user.phone,
      });
      this.profileForm.controls.email.disable();
    }
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.Users = data;
      },
      error: (err) => console.error(err)
    })
  }
  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.minLength(4), Validators.required]),
    lastName: new FormControl('', [Validators.minLength(4), Validators.required]),
    email: new FormControl(''),
    username: new FormControl('', [Validators.minLength(4), Validators.required, this.checkIfUnique()]),
    dateOfBirth: new FormControl('', [Validators.required, this.checkEntryDate()]),
    gender: new FormControl('', Validators.required),
    phone: new FormControl(''),
    currentPassword: new FormControl('', this.checkCurrentPassword()),
    newPassword: new FormControl('', Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/)),
    confirmPassword: new FormControl('', this.checkSimilarity())
  });

  checkIfUnique(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value.trim();
      if (!value) return null;
      if (this.Users.find(u => this.user.id != u.id && u.username.trim() === value)) {
        return { unique: true };
      }
      return null;
    };
  }
  checkEntryDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const selectedDate = new Date(control.value);
      const today = new Date();
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 10);
      return selectedDate > minDate ? { futureDate: true } : null;
    };
  }
  checkCurrentPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const value = control.value.trim();
      if (this.user.password !== value)
        return { NotSimilar: true };
      else
        return null;
    };
  }
  checkSimilarity(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const value = control.value.trim();
      const password = this.profileForm.value.newPassword;
      if (password && password !== value)
        return { NotSimilar: true };
      else
        return null;
    };
  }
  toggleChangePassword(event: PointerEvent) {
    this.profileForm.controls.currentPassword.addValidators(Validators.required);
    this.profileForm.controls.newPassword.addValidators(Validators.required);
    this.profileForm.controls.confirmPassword.addValidators(Validators.required);
    event.preventDefault();
    this.showPasswordFields = true;
  }
  clearConfirmPassword(event: HTMLInputElement) {
    event.value = '';
  }
  saveChanges() {
    if (this.profileForm.valid) {
      this.user.firstName = this.profileForm.value.firstName!.trim();
      this.user.lastName = this.profileForm.value.lastName!.trim();
      this.user.username = this.profileForm.value.username!.trim();
      this.user.gender = this.profileForm.value.gender!.trim();
      this.user.dateOfBirth = this.profileForm.value.dateOfBirth!.trim();
      this.user.phone = this.profileForm.value.phone?.trim() ?? '';
      if (this.showPasswordFields)
        this.user.password = this.profileForm.value.newPassword ? this.profileForm.value.newPassword!.trim() : this.profileForm.value.currentPassword!.trim();
      this.authService.updateUserData(this.user).subscribe({
        next: (data) => {
          // console.log('updating user Successfully!');
          this.authService.UpdateUserToken(this.user);
          this.router.navigate(['/MainHome']);
        },
        error: (err) => console.error('Error in updating user data!', err)
      });
    }
  }
}
