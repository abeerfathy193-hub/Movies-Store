import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, Router } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit{
  user!: IUser;
  constructor(private authService :AuthService, private router: Router){}
  ngOnInit(): void {
    this.user = this.authService.getUserbyToken()!;
  }
  Logout(){
    this.authService.resetUserToken();
    this.router.navigate(["/Login"]);
  }
}
