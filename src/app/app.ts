import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from "./components/navbar/navbar";
import { Footer } from "./components/footer/footer";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isUser = false;
  hideNavbar = false;
  constructor( private router: Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = ['/Dashboard', '/Login', '/Register'].some(com=> event.urlAfterRedirects.includes(com));
      }
  });
  }

  
}