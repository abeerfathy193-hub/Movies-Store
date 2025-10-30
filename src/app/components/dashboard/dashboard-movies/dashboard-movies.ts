import { Component, OnInit, signal } from '@angular/core';
import { MovieService } from '../../../services/movie.service';
import { IGenre } from '../../../Interface/IGenre';
import { IMovie } from '../../../Interface/IMovie';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { App } from '../../../app';
declare var bootstrap: any;


@Component({
  selector: 'app-dashboard-movies',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard-movies.html',
  styleUrl: './dashboard-movies.css'
})

export class DashboardMovies implements OnInit {
  languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'Arabic' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'fa', name: 'Persian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' }
  ];
  genres: IGenre[] = [];
  movies: IMovie[] = [];
  displayedMovies: IMovie[] = [];
  currentIndex = 0;
  itemsPerPage = 8;
  filteredList: IMovie[] = [];

  hideBack = true;
  hideNext = false;
  isAddMode = false;
  selectedGenre: number | null = null;
  modalMessage: string = "";
  modalStatus: boolean = false;
  genre_names: string[] = [];
  genre_ids: number[] = [];

  movieForm = new FormGroup({
    id: new FormControl(0, [Validators.required]),
    title: new FormControl("", [Validators.required]),
    overview: new FormControl("", [Validators.required]),
    genre_ids: new FormControl([], [Validators.required]),
    genre_names: new FormControl([], [Validators.required]),
    full_poster_path: new FormControl("", [Validators.pattern(/^https?:\/\/.+/), Validators.required]),
    full_backdrop_path: new FormControl("", [Validators.required, Validators.pattern(/^https?:\/\/.+/)]),
    release_date: new FormControl("", [Validators.required]),
    price: new FormControl<number | undefined>(undefined, [Validators.required, Validators.min(10)]),
    vote_average: new FormControl<number | undefined>(undefined, [Validators.required, Validators.min(0.1)]),
    trailer: new FormControl("", [Validators.required, Validators.pattern(/^https?:\/\/.+/)]),
    language: new FormControl("", [Validators.required]),

    castStr: new FormControl("", []),
    reviews: new FormControl([], []),
  });

  constructor(private movieService: MovieService) {
  }

  ngOnInit() {
    this.loadData();
  }
  private loadData() {
    this.movieService.getAllGenres().subscribe({
      next: (data) => this.genres = data,
      error: (err) => console.error('Error fetching genres:', err)
    });

    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredList = this.movies;
        this.loadPage();
      },
      error: (err) => console.error('Error fetching movies:', err)
    });
  }

  private loadPage() {
    const start = this.currentIndex;
    const end = this.currentIndex + this.itemsPerPage;

    this.displayedMovies = this.filteredList.slice(start, end);

    this.hideBack = this.currentIndex === 0;
    this.hideNext = end >= this.filteredList.length;
  }

  searchTitle(val: string) {
    val = val.trim().toLowerCase();

    if (val === '') {
      this.filteredList = this.movies;
    } else {
      this.filteredList = this.movies.filter(m =>
        m.title.toLowerCase().includes(val)
      );
    }

    this.currentIndex = 0;
    this.loadPage();
  }

  backward() {
    if (this.currentIndex === 0) return;

    this.currentIndex -= this.itemsPerPage;
    if (this.currentIndex < 0) this.currentIndex = 0;

    this.loadPage();
  }

  forward() {
    if (this.currentIndex + this.itemsPerPage >= this.filteredList.length) return;

    this.currentIndex += this.itemsPerPage;
    this.loadPage();
  }

  addGenre(): void {
    const selectedId = Number(this.movieForm.get('genre_ids')?.value);
    const selectedGenre = this.genres.find(g => g.id == selectedId);

    if (selectedGenre && !this.genre_names.includes(selectedGenre.name)) {
      this.genre_names.push(selectedGenre.name);
      this.genre_ids.push(selectedGenre.id);

      this.movieForm.patchValue({
        genre_names: this.genre_names as never[],
        genre_ids: this.genre_ids as never[]
      });
    }
  }

  removeGenre(index: number): void {
    this.genre_names.splice(index, 1);
    this.genre_ids.splice(index, 1);
    this.movieForm.patchValue({
      genre_names: this.genre_names as never[],
      genre_ids: this.genre_ids as never[]
    });
  }

  addMovie() {
    this.movieForm.patchValue({
      id: 0,
      title: "",
      overview: "",
      genre_ids: [],
      genre_names: [],
      full_poster_path: "",
      full_backdrop_path: "",
      release_date: "",
      price: undefined,
      vote_average: undefined,
      trailer: "",
      language: "",
      castStr: "",
    });
    this.isAddMode = true;
    this.showDataModal();
  }
  saveMovie() {
    debugger
    if (this.movieForm.valid) {
      const movieObj = {
        id: this.isAddMode ? this.getNextId() : this.movieForm.value.id,
        title: this.movieForm.value.title?.trim(),
        overview: this.movieForm.value.overview?.trim(),
        genre_ids: this.movieForm.value.genre_ids,
        genre_names: this.movieForm.value.genre_names,
        full_poster_path: this.movieForm.value.full_poster_path?.trim(),
        full_backdrop_path: this.movieForm.value.full_backdrop_path?.trim(),
        release_date: this.movieForm.value.release_date,
        vote_average: this.movieForm.value.vote_average,
        price: this.movieForm.value.price,
        trailer: this.movieForm.value.trailer?.trim(),
        language: this.movieForm.value.language,
        casting: [], reviews: []
      } as IMovie;

      if (this.movieForm.value.castStr)
        movieObj.casting = this.movieForm.value.castStr.split('\n').map(s => s.trim());

      if (this.isAddMode) { //adding
        this.movieService.addMovie(movieObj).subscribe({
          next: (added) => {
            this.modalStatus = true;
            this.modalMessage = 'Movie added successfully!';
            this.hideDataModal();
            this.showSuccessModal();
            this.loadData();
          },
          error: (err) => {
            this.modalStatus = false;
            this.modalMessage = 'Failed to add movie!';
            this.showSuccessModal();
          }
        });
      }
      else { //updating
        this.movieService.updateMovie(movieObj).subscribe({
          next: (updated) => {
            this.modalStatus = true;
            this.modalMessage = 'Movie updated successfully!';
            this.hideDataModal();
            this.showSuccessModal();
            this.loadData();

          },
          error: (err) => {
            this.modalStatus = false;
            this.modalMessage = 'Failed to edit movie!';
            this.showSuccessModal();
          }
        });

      }
    }

  }
  getNextId(): number {
    if (this.movies.length === 0) return 1;
    const maxId = Math.max(...this.movies.map(u => Number(u.id) || 0));
    return maxId + 1;
  }
  updateMovie(id: number) {
    debugger
    this.isAddMode = false;
    const movie = this.movies.find(m => m.id === id);
    if (movie) {
      this.movieForm.patchValue({
        id: Number(movie.id),
        title: movie.title,
        overview: movie.overview,
        genre_ids: movie.genre_ids as never[],
        genre_names: movie.genre_names as never[],
        full_poster_path: movie.full_poster_path,
        full_backdrop_path: movie.full_backdrop_path,
        release_date: movie.release_date,
        price: movie.price,
        vote_average: movie.vote_average,
        trailer: movie.trailer,
        language: movie.language,
        castStr: movie.casting.join('\n'),
      });
      this.genre_names = movie.genre_names;
      this.genre_ids = movie.genre_ids;
      this.showDataModal();
    }
  }
  removeMovie(id: number) {
    debugger
    this.movieService.deleteMovie(Number(id)).subscribe({

      next: () => {
        this.modalStatus = true;
        this.modalMessage = 'Movie deleted successfully!';
        this.showSuccessModal()
        this.loadData();
      },
      error: (err) => {
        this.modalStatus = false;
        this.modalMessage = 'Failed to delete movie!';
      }
    });

  }

  showSuccessModal() {
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
    setTimeout(() => {
      modal.hide();
    }, 1000);
  }
  showDataModal() {
    const modal = new bootstrap.Modal(document.getElementById('addMovieModal'));
    modal.show();
  }
  hideDataModal() {
    const modalEl = document.getElementById('addMovieModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}
