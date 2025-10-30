import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMovie } from '../Interface/IMovie';
import { IGenre } from '../Interface/IGenre';
import { catchError, forkJoin, map, mergeMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesTMDB {
  private tmdbAPIKey = '8d527d8c1adb6addcb06f292427c95d4';
  private tmdbAPIReadAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZDUyN2Q4YzFhZGI2YWRkY2IwNmYyOTI0MjdjOTVkNCIsIm5iZiI6MTc2MDQzMDE0Mi42ODk5OTk4LCJzdWIiOiI2OGVlMDgzZTg4NWQ3ZDUzMjQ5ZGYwYzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.JHJaMBqCT41icDD9Q_dPoYO1LyJ5H4FfFqIHzK5sE7A';
  private tmdbBaseURL = 'https://api.themoviedb.org/3';
  private tmdbGenresURL = `${this.tmdbBaseURL}/genre/movie/list?api_key=${this.tmdbAPIKey}&language=en-US`;
  private tmdbImageBaseURL = 'https://image.tmdb.org/t/p/w500';
  private genresURL = 'http://localhost:3000/genres';
  movies: IMovie[] = [];
  count = 1;
  Genres: IGenre[] = [];

  constructor(private myClient: HttpClient) {}
checkForDuplicates() {
  const duplicates = this.movies.filter(
    (movie, index, self) =>
      index !== self.findIndex((m) => m.id === movie.id)
  );

  if (duplicates.length > 0) {
    console.warn('⚠️ Duplicate movies found:', duplicates);
  } else {
    console.log('✅ No duplicates found!');
  }
}
loadAllMovies() {
  this.myClient.get<IGenre[]>(this.genresURL).pipe(
    mergeMap((genres) => {
      this.Genres = genres;
      const requests = genres.map(g => this.fetchMoviesByGenre(g.id));
      return forkJoin(requests);
    })
  ).subscribe({
    next: (moviesByGenre) => {
      const allMovies = moviesByGenre.flat().filter(m => m && m.trailer);

      this.movies = allMovies.filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      );
      console.log(JSON.stringify(this.movies));
    },
    error: (err) => {
      console.error('Error loading genres or movies:', err);
    }
  });
}


fetchMoviesByGenre(genreId: number) {
  const tmdbMovieURL = `${this.tmdbBaseURL}/discover/movie?api_key=${this.tmdbAPIKey}&with_genres=${genreId}&language=en-US`;

  return this.myClient.get<{ results: any[] }>(tmdbMovieURL).pipe(
    mergeMap(data => {
      const movies = data.results.slice(0, 20); 
      const movieRequests = movies.map(movie =>
        forkJoin({
          trailer: this.fetchVideoByMovie(movie.id),
          cast: this.fetchCastByMovie(movie.id),
          reviews: this.fetchReviewsByMovie(movie.id)
        }).pipe(
          map(extra => {
            if (!extra.trailer) return null;

            return {
              id: movie.id,
              title: movie.title,
              genre_ids: movie.genre_ids,
              genre_names: movie.genre_ids.map((id: number) => {
                const genreObj = this.Genres.find(g => Number(g.id) === id);
                return genreObj ? genreObj.name : 'Unknown';
              }),
              full_poster_path: this.tmdbImageBaseURL + movie.poster_path,
              full_backdrop_path: this.tmdbImageBaseURL + movie.backdrop_path,
              overview: movie.overview,
              release_date: movie.release_date,
              vote_average: movie.vote_average,
              price: this.getRandomPrice(),
              trailer: extra.trailer,
              reviews: extra.reviews,
              language: movie.original_language,
              casting: extra.cast
            };
          }),
          catchError(err => {
            console.error(`Error fetching details for movie ${movie.id}:`, err);
            return of(null);
          })
        )
      );

      return forkJoin(movieRequests).pipe(
        map(results => results.filter(movie => movie !== null))
      );
    }),
    catchError(err => {
      console.error(`Error fetching movies for genre ${genreId}:`, err);
      return of([]);
    })
  );
}

  fetchVideoByMovie(movieId: number) {
    const url = `${this.tmdbBaseURL}/movie/${movieId}/videos?api_key=${this.tmdbAPIKey}&language=en-US`;
    return this.myClient.get<{ results: any[] }>(url).pipe(
      map(data => {
        const trailer = data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '';
      }),
      catchError(err => {
        console.error(`Error fetching trailer for movie ${movieId}:`, err);
        return of('');
      })
    );
  }

  fetchCastByMovie(movieId: number) {
    const url = `${this.tmdbBaseURL}/movie/${movieId}/credits?api_key=${this.tmdbAPIKey}&language=en-US`;
    return this.myClient.get<{ cast: any[] }>(url).pipe(
      map(data => data.cast.slice(0, 5).map(c => c.name)),
      catchError(err => {
        console.error(`Error fetching cast for movie ${movieId}:`, err);
        return of([]);
      })
    );
  }

  fetchReviewsByMovie(movieId: number) {
    const url = `${this.tmdbBaseURL}/movie/${movieId}/reviews?api_key=${this.tmdbAPIKey}&language=en-US`;
    return this.myClient.get<{ results: any[] }>(url).pipe(
      map(data => data.results.slice(0, 5).map(r => ({
        author: r.author,
        content: r.content
      }))),
      catchError(err => {
        console.error(`Error fetching reviews for movie ${movieId}:`, err);
        return of([]);
      })
    );
  }

  getRandomPrice(): number {
    return Math.floor(Math.random() * 50) + 10; 
  }
}
