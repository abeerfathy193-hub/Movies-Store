import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { IMovie } from '../../../Interface/IMovie';
import { Chart, registerables } from 'chart.js';
import { IGenre } from '../../../Interface/IGenre';

@Component({
  selector: 'app-dashboard-home',
  imports: [],
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css'
})
export class DashboardHome implements OnInit {
  movies: IMovie[] = [];
  genres: IGenre[] = [];
  avgPrice = 0;
  highRatedMovie?: IMovie;


  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getAllGenres().subscribe({
      next: (data) => this.genres = data,
      error: (err) => console.error('Error fetching genres:', err)
    });
    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.calculateStates();
        this.generateChart();
      },
      error: (err) => console.error('Error fetching movies:', err)
    });
  }

  calculateStates() {
    this.highRatedMovie = this.movies[0];
    let sum = 0;
    for (let movie of this.movies) {
      if (this.highRatedMovie.vote_average! < movie.vote_average!)
        this.highRatedMovie = movie;
      sum += movie.price!;
    }
    this.avgPrice = Number((sum / this.movies.length).toFixed(2));

  }

  generateChart() {
    Chart.register(...registerables);
    const genreCounts: { [key: string]: number } = {};
    this.movies.forEach(movie => {
      if (movie.genre_names)
        movie.genre_names.forEach((g: string) => {
          genreCounts[g] = (genreCounts[g] || 0) + 1;
        });
    });

    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);
    new Chart('genreChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Movies per Genre',
          data,
          borderWidth: 1,
          backgroundColor: 'rgba(0, 153, 255, 0.6)',
          borderColor: '#00aaff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              color: '#fff'
            },
            grid: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#fff'
            },
            grid: {
              color: 'rgba(255,255,255,0.1)'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#fff'
            }
          }
        }
      }
    });

  }

}
