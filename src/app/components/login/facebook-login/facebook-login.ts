declare const FB: any;
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../Interface/IUser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-facebook-login',
  imports: [],
  templateUrl: './facebook-login.html',
  styleUrl: './facebook-login.css'
})
export class FacebookLogin {
  constructor(private myService: AuthService, private router: Router) { }
  users: IUser[] = [];
  email: string[] = [];
  // user!: IUser;

  ngOnInit() {
    this.myService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data
        for (let user of this.users) {
          this.email.push(user.email)
        }
      },
      error: (error) => console.log("filed to get users", error)
    })
  }

  facebookLogin() {
    console.log('fb login called');
    FB.login((response: any) => {
      if (response.authResponse) {


        FB.api('/me', { fields: 'name,email,picture' }, (response: { name: string, email: string, picture?: string }) => {
          console.log('response', response);
          const user = {
            id: this.myService.getNextId(this.users),
            firstName: response.name.trim(),
            lastName: '',
            username: '',
            email: response.email.trim(),
            password: '',
            dateOfBirth: '',
            gender: '',
            phone: undefined,
            createdAt: new Date(),
            loginMethod: 'facebook',
            isActive: true,
            role: 'user'
          } as IUser;
          if (this.email.includes(user.email)) {
            this.myService.setUserToken(user);
            this.router.navigate(['/MainHome']);
          } else {
            this.myService.postUserData(user).subscribe({
              next: (response) => {
                console.log(' User created', response);
                this.myService.setUserToken(response);
                this.router.navigate(['/MainHome']);
              },
              error: (err) => console.error(' Error:createtion', err),
            });
          }
        });
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email' });
  }
}
