import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { IGenre } from '../../Interface/IGenre';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { SharedServices } from '../../services/shared-services';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})

export class Navbar implements OnInit {
  genres: IGenre[] = [];
  lockFlag = false;
  constructor(private movieService: MovieService, private authService: AuthService, private sharedService: SharedServices, private router: Router) { }
  ngOnInit(): void {
    debugger
    this.movieService.getAllGenres().subscribe({
      next: (data) => this.genres = data,
      error: (err) => console.error('Error fetching genres:', err)
    });

    this.lockFlag = this.authService.getUserbyToken() ? true : false;
  }
  onSearchInput(event: any): void {

    const term = event.target.value.trim().toLowerCase();
    this.sharedService.triggerSearchTerm(term);
  }
  OnReloadMovies() {
    this.sharedService.triggerReloadAll();
    this.router.navigateByUrl("/MainHome");
  }
  selectGenre(name: string) {
    this.sharedService.triggerGenreSelected(name);
  }
  terminateSession() {
    this.authService.resetUserToken();
    this.router.navigate(["/Login"]);
  }
}