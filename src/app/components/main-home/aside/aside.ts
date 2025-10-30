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

  @Output() genreSelected = new EventEmitter<string>();

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getAllGenres().subscribe((data) => {
      this.genres = data.slice(0, 10); // only 10 genres
    });
  }

  selectGenre(name: string) {
    this.genreSelected.emit(name);
  }

}