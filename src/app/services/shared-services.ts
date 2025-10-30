import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedServices {
  private passSearchTerm = new Subject<string>();
  reloadTerm$ = this.passSearchTerm.asObservable();
  private passGenreSelected = new Subject<string>();
  reloadGenre$ = this.passGenreSelected.asObservable();
  private passViewAll = new Subject<void>();
  reloadAll$ = this.passViewAll.asObservable();

  constructor() { }
  triggerReloadAll() {
    this.passViewAll.next();
  }
  triggerSearchTerm(term: string) {
    this.passSearchTerm.next(term);
  }
  triggerGenreSelected(genre: string) {
    this.passGenreSelected.next(genre);
  }
}
