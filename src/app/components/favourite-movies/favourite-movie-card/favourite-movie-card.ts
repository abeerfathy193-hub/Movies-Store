import { SlicePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-favourite-movie-card',
  imports: [SlicePipe, RouterLink],
  templateUrl: './favourite-movie-card.html',
  styleUrl: './favourite-movie-card.css'
})
export class FavouriteMovieCard {
  constructor() { }
  @Input() movie: any; // movie passed from parent

  @Output() remove = new EventEmitter<string>();

  onRemove() {
    this.remove.emit(this.movie.favId);
  }
}

