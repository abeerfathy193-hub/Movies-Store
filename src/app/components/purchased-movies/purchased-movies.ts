import { Component, OnInit } from '@angular/core';
import { PurchasedServices } from '../../services/purchased-services';
import { PurchasedMovieCard } from './purchased-movie-card/purchased-movie-card';
import { MovieService } from '../../services/movie.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';

@Component({
  selector: 'app-purchased-movies',
  imports: [PurchasedMovieCard],
  templateUrl: './purchased-movies.html',
  styleUrl: './purchased-movies.css'
})
export class PurchasedMovies implements OnInit {
  // simulate logged-in user
  allPurchasedMoviesData: any[] = [];
  user!: IUser;

  constructor(private purchasedService: PurchasedServices, private authService: AuthService,
    private movieService: MovieService) { }

  ngOnInit(): void {
    const user = this.authService.getUserbyToken();
    if (user)
      this.user = user;
    this.loadPurchasedMovies();
  }

  loadPurchasedMovies(): void {
    this.purchasedService.getPurchasedMovies(this.user.id).subscribe({
      next: (purchasedMovies) => {
        console.log('Fetched purchased movies:', purchasedMovies);

        this.allPurchasedMoviesData = []; // Clear old data

        purchasedMovies.forEach((purchase) => {
          console.log('Fetching details for movie ID:', purchase);
          this.movieService.getMovieById(purchase.movieId).subscribe({
            next: movieData => {
              // Merge movie details with purchase info
              const mergedMovie = {
                ...movieData,
                purchaseDate: purchase.purchaseDate,
                pricePaid: purchase.pricePaid
              };
              this.allPurchasedMoviesData.push(mergedMovie);
            },
            error: err => console.error('Error fetching movie data', err)
          });
        });
      },
      error: err => console.error('Error loading purchased movies', err)
    });
  }
}
