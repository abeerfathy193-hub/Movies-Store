declare var google: any;
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../Interface/IUser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-google-login',
  standalone: true,
  templateUrl: './google-login.html',
  styles: ``
})

export class GoogleLogin implements OnInit {
  constructor(private myService: AuthService, private router: Router) { }
  users: IUser[] = [];
  email: string[] = [];
  // user!: IUser;
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '600711133611-49crnvp0ts6jpskqt7b9ij2hijk2nl7v.apps.googleusercontent.com',
      callback: (response: any) => this.handelLogin(response)
    }
    );

    google.accounts.id.renderButton(
      document.getElementById("g_id_signin"),
      {
        type: "icon",
        shape: "circle",
        theme: "filled_black",
        size: "large",
        color_scheme: "dark"
      }
    );

    this.myService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data
        for (let user of this.users) {
          this.email.push(user.email)
          console.log(this.users.length)
        }
      },
      error: (error) => console.log("filed to get users", error)
    })

  }
  private decodeJwtResponse(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  handelLogin(res: any) {
    console.log("google", res)
    if (res) {
      const data = this.decodeJwtResponse(res.credential);
      // console.log('user', JSON.stringify(this.users))
      const user = this.users.find(u=> u.email === data.email.trim());
      if (user) {
        console.log('login')
        this.myService.setUserToken(user);
        this.router.navigate(['/MainHome']);
      } else {
        const user = {
        id: this.myService.getNextId(this.users),
        firstName: data.given_name.trim(),
        lastName: data.family_name.trim(),
        username: '',
        email: data.email.trim(),
        password: '',
        dateOfBirth: '',
        gender: '',
        phone: undefined,
        createdAt: new Date(),
        loginMethod: 'google',
        isActive: true,
        role: 'user'
      } as IUser;
        this.myService.postUserData(user).subscribe({
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
}
