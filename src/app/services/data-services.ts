import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Base URL for JSON server
  private readonly BASE_URL = 'https://moviestoredb-production.up.railway.app';

  // Endpoints
  public readonly USERS_URL = `${this.BASE_URL}/users`;
  public readonly MOVIES_URL = `${this.BASE_URL}/movies`;
  public readonly GENRES_URL = `${this.BASE_URL}/genres`;
  public readonly FAVOURITE_URL = `${this.BASE_URL}/favourite`;
  public readonly PURCHASED_URL = `${this.BASE_URL}/purchased`;

  constructor() {}
}
