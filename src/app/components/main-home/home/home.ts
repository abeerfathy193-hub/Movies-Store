import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HeroSlider } from '../hero-slider/hero-slider';
import { Aside } from '../aside/aside';
import { MovieCard } from '../movie-card/movie-card';


@Component({
  selector: 'app-home',
  imports: [HeroSlider, Aside, MovieCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  selectedGenre: string = '';

  onGenreSelected(genre: string) {
    this.selectedGenre = genre;
  }

  // slides = [
  //   {
  //     image: 'hero1.jpg',
  //     title: 'Spider-Man:\n Across the Spider-Verse',
  //     genres: ['Animation', 'Adventure'],
  //     description: 'In an attempt to curb the Spot, a scientist, Miles Morales joins forces with Gwen Stacy...'
  //   },
  //   {
  //     image: 'hero2.jpg',
  //     title: 'Avatar: The Way of Water',
  //     genres: ['Sci-Fi', 'Action'],
  //     description: 'Jake Sully and Ney\'tiri have formed a family and are doing everything to stay together...'
  //   },
  //   {
  //     image: 'hero3.jpg',
  //     title: 'Blade Runner 2049',
  //     genres: ['Sci-Fi', 'Action'],
  //     description: 'K, an officer with the Los Angeles Police Department, unearths a secret that could create chaos...'
  //   },

  // ];

}
