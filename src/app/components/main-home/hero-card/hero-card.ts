import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { FavouriteServices } from '../../../services/favourite-services';
import { MovieService } from '../../../services/movie.service';
import { AuthService } from '../../../services/auth.service';
import { IFavourite } from '../../../Interface/IFavourite';
import { IUser } from '../../../Interface/IUser';

@Component({
  selector: 'app-hero-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-card.html',
  styleUrl: './hero-card.css'
})

export class HeroCard implements OnInit {
  @Input() id!: number;
  @Input() image!: string;
  @Input() title!: string;
  @Input() genres!: string[];
  @Input() description!: string;

  private isLoggedIn = false;
  isFavorite = false;
  lastId = 0;
  User!: IUser;

  constructor(private route: Router, private favouriteServices: FavouriteServices, private movieService: MovieService, private authService: AuthService) { }
  ngOnInit(): void {
    this.loadUserData();
  }
  loadUserData() {
    const user = this.authService.getUserbyToken();
    if (user) {
      this.User = user;
      this.favouriteServices.getAllFavourites().subscribe({

        next: (data) => {
          const fav = data.find(x => x.movieId === this.id && x.userId === Number(this.User.id))
          this.isFavorite = fav ? true : false;
          if (data.length > 0)
            this.lastId = Number(data[data.length - 1].id);

        },
        error: err => console.error('Error getting favourite', err)
      });
    }
  }
  toggleFavorite() {
    if (this.isLoggedIn) {
      this.isFavorite = !this.isFavorite;
      if (this.isFavorite) {
        const favourite = { userId: Number(this.User.id), movieId: Number(this.id), id: String(this.lastId + 1) } as IFavourite;
        this.favouriteServices.addFavourite(favourite);
      } else {
        this.favouriteServices.removeFavouritebyMovieAndUserId(this.User.id, this.id);
      }
    }
  }
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
