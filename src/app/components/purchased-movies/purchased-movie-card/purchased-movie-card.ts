import { SlicePipe, DecimalPipe, DatePipe, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-purchased-movie-card',
  imports: [SlicePipe, DatePipe, RouterLink],
  templateUrl: './purchased-movie-card.html',
  styleUrl: './purchased-movie-card.css'
})
export class PurchasedMovieCard {
  constructor() { }
  @Input() movie: any; // movie passed from parent
}
