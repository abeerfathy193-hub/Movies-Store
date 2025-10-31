import { Component, EventEmitter, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../../services/movie.service';

@Component({
  selector: 'app-aside',
  imports: [CommonModule],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})

export class Aside {
  genres: any[] = [];
  selectedGenre: string = '';

  @Output() genreSelected = new EventEmitter<string>();

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getAllGenres().subscribe((data) => {
      this.genres = data.slice(0, 10);
    });
  }

  selectGenre(name: string) {
    this.selectedGenre = name;
    this.genreSelected.emit(name);
  }
}