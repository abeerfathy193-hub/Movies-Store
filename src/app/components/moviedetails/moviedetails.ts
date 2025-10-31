import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Castlist } from './castlist/castlist';
import { Videoplayer } from './videoplayer/videoplayer';
import { Reviews } from './reviews/reviews';
import { IMovie } from '../../Interface/IMovie';
import { MovieService } from '../../services/movie.service';
import { FavouriteServices } from '../../services/favourite-services';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../Interface/IUser';
import { IFavourite } from '../../Interface/IFavourite';
import { PurchasedServices } from '../../services/purchased-services';

// interface Movie {
//   id: number;
//   title: string;
//   year: number;
//   duration: number;
//   price: number;
//   genre: string[];
//   rating: number;
//   releaseDate: Date;
//   overview: string;
//   posterUrl: string;
//   trailerUrl: string;
//   videoUrl?: string;
//   director: string;
//   production: string;
//   language: string;
//   budget: number;
//   cast: { name: string; role: string; photo: string }[];
//   reviews: { user: string; comment: string}[];
// }

@Component({
  selector: 'app-moviedetails',
  standalone: true,
  imports: [CommonModule, FormsModule, Castlist, Videoplayer, Reviews],
  templateUrl: './moviedetails.html',
  styleUrls: ['./moviedetails.css']
})
export class Moviedetails implements OnInit {
  movie!: IMovie;
  safeTrailerUrl: SafeResourceUrl | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  safeBackdropUrl: SafeResourceUrl | null = null;
  safePosterUrl: SafeResourceUrl | null = null;
  isFavorite: boolean = false;
  hasPurchased: boolean = false;
  isLoggedIn: boolean = false;
  User!: IUser;
  newReview = {
    author: '',
    content: '',
  };

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router, private purchasedService: PurchasedServices,
    private favouriteServices: FavouriteServices, private movieService: MovieService, private authService: AuthService) { }

  ngOnInit(): void {
    debugger
    const movieFromState = history.state['movie'];
    if (movieFromState) {
      this.movie = movieFromState;
      this.updateSafeUrls();
    } else {
      const movieId = Number(this.route.snapshot.paramMap.get('id'));
      this.movieService.getMovieById(movieId).subscribe((movie) => {
        if (movie) {
          this.movie = movie;
          this.updateSafeUrls();
        } else {
          alert('Movie not found!');
        }
      });
      this.updateSafeUrls();
      this.loadUserData(movieId);

    }
  }
  loadUserData(movieId: number) {
    const user = this.authService.getUserbyToken();
    if (user) {
      this.isLoggedIn = true;
      this.User = user;
      this.favouriteServices.checkFavourite(Number(this.User.id), Number(movieId)).subscribe({
        next: (data) => {
          this.isFavorite = data.length > 0 ? true : false;
        },
        error: err => console.error('Error getting favourite', err)
      });
      // purchased
      this.purchasedService.checkPurchasedMovies(Number(this.User.id), Number(movieId)).subscribe({
        next: (data) => {
          debugger
          this.hasPurchased = data.length > 0 ? true : false;
        },
        error: err => console.error('Error getting purchased', err)
      });
    }

  }

  loadMovieFromFile(id: number): void {
    /* this.movie = {
      id,
      title: 'Conjuring',
      year: 2025,
      duration: 148,
      price: 10.99,
      genre: ['Horror', 'Mystery', 'Thriller'],
      rating: 8.8,
      releaseDate: new Date('2025-09-10'),
      overview:
        'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse. Forced to confront a powerful demonic entity, the Warrens face their most terrifying case yet.',
      posterUrl:
        'https://m.media-amazon.com/images/M/MV5BOGU3OTk3ZjgtMTE1YS00ZTFkLTgwNGEtMWMxYjc5N2VkMjBmXkEyXkFqcGc@._V1_.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=k10ETZ41q5o',
      videoUrl: 'https://www.youtube.com/watch?v=k10ETZ41q5o',
      director: 'James wan',
      production: 'New Line Cinema / Warner Bros. Pictures',
      language: 'English',
      budget: 20000000,
      cast: [
    {
      name: 'Vera Farmiga',
      role: 'Lorraine Warren',
      photo:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTK9qdMQa7ceTEoDImKiZjUvXFde3ya-wQoQ&s'
    },
    {
      name: 'Patrick Wilson',
      role: 'Ed Warren',
      photo:
        'https://image.tmdb.org/t/p/w500/tc1ezEfIY8BhCy85svOUDtpBFPt.jpg'
    },
    {
      name: 'Lili Taylor',
      role: 'Carolyn Perron',
      photo:
        'https://ntvb.tmsimg.com/assets/assets/39327_v9_bb.jpg'
    },
    {
      name: 'Ron Livingston',
      role: 'Roger Perron',
      photo:
        'https://images.fandango.com/ImageRenderer/300/0/redesign/static/img/default_poster.png/0/images/masterrepository/performer%20images/402613/RonLivingston-2019_r.jpg'
    }
  ],
  reviews: [
    { user: 'Mina', comment: 'Terrifying and suspenseful! A true modern horror classic.', rating: 9 },
    { user: 'Adam', comment: 'The Warrens make this film hauntingly believable.', rating: 8 },
    { user: 'Layla', comment: 'Perfect blend of scares and story.', rating: 9 }
  ]
    }; */

  }

  private extractYoutubeId(url?: string): string | null {
    if (!url) return null;
    // remove params after and if present
    const vParam = url.match(/[?&]v=([^&]+)/);
    if (vParam && vParam[1]) return vParam[1];
    const short = url.match(/youtu\.be\/([^?&]+)/);
    if (short && short[1]) return short[1];
    const embed = url.match(/\/embed\/([^?&]+)/);
    if (embed && embed[1]) return embed[1];
    // try last path segment
    try {
      const u = new URL(url);
      const parts = u.pathname.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : null;
    } catch {
      return null;
    }
  }

  private updateSafeUrls(): void {
    const trailerId = this.extractYoutubeId(this.movie?.trailer);
    if (trailerId) {
      const trailerEmbedUrl = `https://www.youtube.com/embed/${trailerId}`;
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(trailerEmbedUrl);
    } else {
      this.safeTrailerUrl = null;
    }

    if (this.movie?.full_backdrop_path) {
      this.safeBackdropUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.full_backdrop_path);
    } else {
      this.safeBackdropUrl = null;
    }

    if (this.movie?.full_poster_path) {
      this.safePosterUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.full_poster_path);
    } else {
      this.safePosterUrl = null;
    }
    // const videoId = this.extractYoutubeId(this.movie?.videoUrl);//for full movie (using trailer again)
    // if (videoId) {
    //   const videoEmbedUrl = `https://www.youtube.com/embed/${videoId}`;
    //   this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoEmbedUrl);
    // } else {
    //   this.safeVideoUrl = null;
    // }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      const favourite = { userId: Number(this.User.id), movieId: Number(this.movie.id) } as IFavourite;
        this.favouriteServices.addFavourite(favourite).subscribe({
          next: ()=> console.log('Adding in Favourite'),
          error: (err) => console.error(err)          
        });
    } else {
      this.favouriteServices.removeFavourite(Number(this.User.id), Number(this.movie.id));
      // alert(`❌ Removed "${this.movie.title}" from favorites.`);
    }
  }

  submitReview(review: { author: string, content: string }): void {
    if (!this.movie.reviews || this.movie.reviews.length === 0)
      this.movie.reviews = []
    this.movie.reviews!.push(review);
    this.movieService.addReview(this.movie.id, review);
    // alert('Review submitted successfully!');
    // this.newReview = { author: '', content: '' };
  }

  /* buyNow(movie: any) {
    this.isLoggedIn = true; // simulate login check (replace with actual auth later)

    if (!this.isLoggedIn) {
      alert('Please log in first to continue!');
      // this.router.navigate(['/login']);
      return;
    }

    // if logged in, simulate payment
    const paymentSuccess = confirm(`Confirm purchase of "${movie.title}" for $${movie.price}?`);
    // this.router.navigate(['/payment']);

    if (paymentSuccess) {
      this.hasPurchased = true;
      alert('Purchase successful! Enjoy your movie 🍿');
    }
  }


  simulateLogin(): void {
    this.isLoggedIn = true;
    alert('🔐 You are now logged in (simulated)');
  } */


  buyNow(movie: IMovie) {
    // Check if user is logged in
    if (!this.isLoggedIn) {
      this.router.navigate(['/Login'], {
        state: { returnUrl: `/Moviedetails/${movie.id}` }
      });
    }
    this.router.navigate(['/Payment'], {
      state: {
        movie: this.movie,
        user: this.User,
        returnUrl: `/Moviedetails/${movie.id}`
      }
    });

  }
}
