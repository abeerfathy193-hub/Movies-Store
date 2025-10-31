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

  // Add a new favourite movie
  addFavourite(favourite: IFavourite) {
    debugger
    return this.favouriteHttpClient.post<IFavourite>(this.favouritesURL, favourite);
  }
  getFavouritesbyUserId(userId: number) {
    return this.favouriteHttpClient.get<IFavourite[]>(`${this.favouritesURL}?userId=${userId}`);
  }
  getFavouritesbyMovieId(movieId: number) {
    return this.favouriteHttpClient.get<IFavourite[]>(`${this.favouritesURL}?movieId=${movieId}`);
  }
  checkFavourite(userId: number, movieId: number) {
    return this.favouriteHttpClient.get<IFavourite[]>(`${this.favouritesURL}?userId=${userId}&movieId=${movieId}`);
  }
  removeFavourite(userId: number, movieId: number) {
    this.checkFavourite(userId, movieId).subscribe({
      next: (data) => {
        if (data.length == 1)
          this.favouriteHttpClient.delete(`${this.favouritesURL}/${data[0].id}`).subscribe({
            next: () => console.log('Favourite deleted!'),
            error: () => console.error('Error removing favourite')
          })
      },
      error: (err) => {
        console.error('Error in getting favourites', err)
      }
    });
  }

  removeFavourites(movieId: number) {
    this.getFavouritesbyMovieId(movieId).subscribe({
      next: (data) => {
        for (let ele of data) {
          this.favouriteHttpClient.delete(`${this.favouritesURL}/${ele.id}`).subscribe({
            next: () => console.log('Favourite deleted!'),
            error: () => console.error('Error removing favourite')
          });
        }
      },
      error: (err) => {
        console.error('Error in getting favourites', err)
      }
    });
  }

  removeFavouritebyId(favId: string) {
    return this.favouriteHttpClient.delete(`${this.favouritesURL}/${favId}`);
  }

}
