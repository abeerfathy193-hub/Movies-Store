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
  getPurchasedMovieByUserId(userId: number, movieId: number){
    return this.purchasedHttpClient.get<IPurchased[]>(`${this.purchasedURL}?userId=${userId}&movieId=${movieId}`);
  }
  // Add a purchased movie
  addPurchasedMovie(newPurchase: IPurchased) {
    return this.purchasedHttpClient.post<IPurchased>(this.purchasedURL, newPurchase);
  }
}
