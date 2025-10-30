import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data-services';
import { IFavourite } from '../Interface/IFavourite';

@Injectable({
  providedIn: 'root'
})
export class FavouriteServices {

  favouritesURL: string = '';

  constructor(private dataService: DataService,
    private favouriteHttpClient: HttpClient) {
    this.favouritesURL = this.dataService.FAVOURITE_URL;
  }

  getAllFavourites() {
    return this.favouriteHttpClient.get<IFavourite[]>(`${this.favouritesURL}`);
  }

  getFavourites(userId: number) {
    console.log('Getting favourites for user:', userId); //debugging line
    return this.favouriteHttpClient.get<IFavourite[]>(`${this.favouritesURL}?userId=${userId}`);
  }

  // Add a new favourite movie
  addFavourite(favourite: IFavourite) {
    debugger
    return this.favouriteHttpClient.post<IFavourite>(this.favouritesURL, favourite).subscribe({});
  }

  // Remove a favourite movie
  removeFavourite(favId: string) {
    return this.favouriteHttpClient.delete(`${this.favouritesURL}/${favId}`);
  }
  removeFavouritebyMovieAndUserId(userId: number, movieId: number) {
    this.favouriteHttpClient.get<IFavourite[]>(`${this.favouritesURL}?userId=${userId}&movieId=${movieId}`).subscribe({
      next: (data) => {
        if (data.length > 0)
          this.favouriteHttpClient.delete(`${this.favouritesURL}/${data[0].id}`).subscribe({});
      },
      error: err => console.error('Error removing favourite', err)
    });
  }
}
