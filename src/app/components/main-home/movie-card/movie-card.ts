import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { IMovie } from '../../../Interface/IMovie';
import { MovieService } from '../../../services/movie.service';
import { SharedServices } from '../../../services/shared-services';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCard implements OnInit {
  @Input() selectedGenre: string = '';
  searchTerm: string = '';
  allMovies: IMovie[] = [];
  filteredMovies: IMovie[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 24;

  constructor(private movieService: MovieService, private sharedService: SharedServices) { }

  ngOnInit(): void {
    this.movieService.getAllMovies().subscribe((data) => {
      this.allMovies = data;
      this.applyFilters();
    });
    this.sharedService.reloadAll$.subscribe(() => {
      this.selectedGenre = '';
      this.searchTerm = '';
      this.applyFilters();
    });
    this.sharedService.reloadTerm$.subscribe((data) => {
      this.searchTerm = data;
      this.applyFilters();
    });
    this.sharedService.reloadGenre$.subscribe((data) => {
      this.selectedGenre = data;
      this.applyFilters();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedGenre']) {
      this.applyFilters();
    }
  }

  private applyFilters(): void {
    this.filteredMovies = this.allMovies.filter(movie => {
      const matchGenre =
        (!this.selectedGenre || movie.genre_names[0] === this.selectedGenre);
      const matchSearch =
        !this.searchTerm ||
        movie.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchGenre && matchSearch;
    });

    this.currentPage = 1;
  }

  // Pagination logic
  get totalPages(): number {
    return Math.ceil(this.filteredMovies.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get pagedMovies(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredMovies.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  prevPage(): void {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }
}
