import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroCard } from "../hero-card/hero-card";
import { IMovie } from '../../../Interface/IMovie';
import { MovieService } from '../../../services/movie.service';

@Component({
  selector: 'app-hero-slider',
  imports: [CommonModule, HeroCard],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSlider {
  top5Movies: IMovie[] = [];

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getAllMovies().subscribe((data) => {
      this.top5Movies = (this.sortByProperty(data, "vote_average")).slice(0, 5);
      this.top5Movies = this.top5Movies.map(movie => {
        const words = movie.overview.split(' ');
        const shortOverview = words.length > 50
          ? words.slice(0, 50).join(' ') + '...'
          : movie.overview;

        return { ...movie, overview: shortOverview };
      });
    });
  }

  sortByProperty<T, K extends keyof T>(
    array: T[],
    key: K,
    ascending: boolean = true
  ): T[] {
    return [...array].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      // Handle undefined/null values safely
      if (valA == null && valB == null) return 0;
      if (valA == null) return ascending ? 1 : -1;
      if (valB == null) return ascending ? -1 : 1;

      // Compare numbers or dates
      if (typeof valA === "number" && typeof valB === "number") {
        const numA = valA;
        const numB = valB;
        return ascending ? numA - numB : numB - numA;
      }

      // Compare strings (case-insensitive)
      if (typeof valA === "string" && typeof valB === "string") {
        return ascending
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      // Fallback for other types
      return 0;
    });
  }

}
