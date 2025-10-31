import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FavouriteServices } from '../../services/favourite-services';
import { FavouriteMovieCard } from './favourite-movie-card/favourite-movie-card';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';


@Component({
  selector: 'app-favourite-movies',
  imports: [FavouriteMovieCard],
  templateUrl: './favourite-movies.html',
  styleUrl: './favourite-movies.css'
})
export class FavouriteMovies implements OnInit {

  user!:IUser; // simulate logged-in user
  favouriteMovies: any[] = [];

  constructor(private favouriteService: FavouriteServices,
              private movieService: MovieService,
              private changeDetector: ChangeDetectorRef, private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getUserbyToken();
    if(user)
      this.user = user;
    this.loadFavourites();
  }


  loadFavourites(): void {
    this.favouriteService.getFavouritesbyUserId(Number(this.user.id)).subscribe({
    next: (favs) => {
      debugger
      this.favouriteMovies = [];
      favs.forEach(fav => {
        this.movieService.getMovieById(fav.movieId).subscribe({
          next: movie => {
            this.favouriteMovies.push({
              ...movie,
              favId: fav.id // store favourite record id
            });
          }
        });
      });
    }
  });
  }  

  removeFromFavourites(favId: string) {
  this.favouriteService.removeFavouritebyId(favId).subscribe({

    next: () => {
      this.favouriteMovies = this.favouriteMovies.filter(m => m.favId !== favId);
      console.log(`Removed favourite with ID ${favId}`);
      this.changeDetector.detectChanges();
    },
    error: err => console.error('Error removing favourite', err)
  });
}
}
