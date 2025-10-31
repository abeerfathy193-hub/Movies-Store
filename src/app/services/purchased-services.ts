import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { DataService } from './data-services';

@Injectable({
  providedIn: 'root'
})
export class PurchasedServices {

  purchasedURL: string = '';

  constructor(private dataService: DataService,
    private purchasedHttpClient: HttpClient) {
    this.purchasedURL = this.dataService.PURCHASED_URL;
  }

  // Get all purchased movie IDs for this user
  getPurchasedMovies(userId: number) {
    console.log('Getting purchases for user:', userId);
    return this.purchasedHttpClient.get<IPurchased[]>(`${this.purchasedURL}?userId=${userId}`);
  }
  checkPurchasedMovies(userId: number, movieId: number) {
    return this.purchasedHttpClient.get<IPurchased[]>(`${this.purchasedURL}?userId=${userId}&movieId=${movieId}`);
  }
  // Add a purchased movie
  addPurchasedMovie(newPurchase: IPurchased) {
    return this.purchasedHttpClient.post<IPurchased>(this.purchasedURL, newPurchase);
  }
  getPurchasedByMovieId(movieId: number) {
    return this.purchasedHttpClient.get<IPurchased[]>(`${this.purchasedURL}?movieId=${movieId}`);
  }
  removePurchasedMovies(movieId: number) {
    this.getPurchasedByMovieId(movieId).subscribe({
      next: (data) => {
        for (let ele of data) {
          this.purchasedHttpClient.delete(`${this.purchasedURL}/${ele.id}`).subscribe({
            next: () => console.log('Purchased deleted!'),
            error: () => console.error('Error in removing purchased')
          });
        }
      },
      error: (err) => console.error('Error in getting purchased', err)
    });
  }
}
