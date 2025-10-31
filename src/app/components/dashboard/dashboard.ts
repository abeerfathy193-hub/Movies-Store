import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLinkWithHref } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, CommonModule, RouterLinkWithHref],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  user!: IUser;
  openAside = false;
  constructor(private authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.user = this.authService.getUserbyToken()!;
  }
  toggleAside(){
    this.openAside = !this.openAside;
  }
  Logout() {
    this.authService.resetUserToken();
    this.router.navigate(["/Login"]);
  }
}
