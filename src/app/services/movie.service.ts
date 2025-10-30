import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMovie } from '../Interface/IMovie';
import { IGenre } from '../Interface/IGenre';
import { DataService } from './data-services';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  movies: IMovie[] = [];
  genres: IGenre[] = [];


  constructor(private myClient: HttpClient, private dataService: DataService) { }

  getAllGenres() {
    return this.myClient.get<IGenre[]>(this.dataService.GENRES_URL);
  }

  getAllMovies() {
    return this.myClient.get<IMovie[]>(this.dataService.MOVIES_URL);
  }

  getMovieById(id: number) {
    return this.myClient.get<IMovie>(`${this.dataService.MOVIES_URL}/${id}`);
  }

  addMovie(movie: IMovie) {
    return this.myClient.post<IMovie>(this.dataService.MOVIES_URL, movie);
  }

  updateMovie(movie: IMovie) {
    return this.myClient.put<IMovie>(`${this.dataService.MOVIES_URL}/${movie.id}`, movie);
  }

  deleteMovie(id: number) {
    return this.myClient.delete(`${this.dataService.MOVIES_URL}/${id}`);
  }

  addReview(movieId: number, newReview: any): void {
    this.myClient.get<any>(`${this.dataService.MOVIES_URL}/${movieId}`).subscribe(movie => {
      const updatedMovie = {
        ...movie,
        reviews: [...movie.reviews, newReview]
      };
      this.myClient.put<IMovie>(`${this.dataService.MOVIES_URL}/${movieId}`, updatedMovie)
        .subscribe({
          next: () => console.log('Review added successfully!'),
          error: err => console.error('Error adding review:', err)
        });
    });
  }
}
