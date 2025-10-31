import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../Interface/IUser';
import { Token } from '../utilities/Token';
import { DataService } from './data-services';
declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private myClient: HttpClient, private dataService: DataService) {
  }

  getAllUsers() {
    return this.myClient.get<IUser[]>(this.dataService.USERS_URL);
  }
  UpdateUserToken(user: IUser) {
    const remeberMeChecker = (document.cookie && document.cookie.includes('userToken')) ? true : false;
    this.resetUserToken();
    this.setUserToken(user, remeberMeChecker);
  }
  setUserToken(user: IUser, remeberMe: boolean = false) {
    let tokenUtil = new Token();
    const token = tokenUtil.encryptToken(user);
    if (remeberMe) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now
      document.cookie = `userToken=${encodeURIComponent(token)}; expires=${expiryDate.toUTCString()}; path=/`;
    }
    sessionStorage.setItem("userToken", token);
  }
  getUserbyToken(): IUser | null {
    if (document.cookie && document.cookie.includes('userToken')) {
      const startIdx = document.cookie.indexOf('userToken') + 10;// 10 for 'userToken='
      let tokenUtil = new Token();
      const value = document.cookie.substring(startIdx);
      const user = tokenUtil.decryptToken(decodeURIComponent(value));
      if (sessionStorage.getItem("userToken"))
        sessionStorage.setItem("userToken", value);
      return user;
    }
    else {
      if (sessionStorage.getItem("userToken")) {
        let tokenUtil = new Token();
        const user = tokenUtil.decryptToken(sessionStorage.getItem("userToken")!);
        return user;
      }
    }
    return null;
  }
  resetUserToken() {
    google.accounts.id.disableAutoSelect();
    if (document.cookie && document.cookie.includes('userToken'))
      document.cookie = `userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    if (sessionStorage.getItem("userToken"))
      sessionStorage.removeItem("userToken");
  }

  postUserData(user: IUser) {
    return this.myClient.post<IUser>(this.dataService.USERS_URL, user)
  }
  updateUserData(user: IUser) {
    return this.myClient.put<IUser>(`${this.dataService.USERS_URL}/${user.id}`, user)
  }
  getNextId(list: IUser[]): number {
    if (list.length === 0) return 1;
    const maxId = Math.max(...list.map(u => Number(u.id) || 0));
    return maxId + 1;
  }

  // gSignOut() {
  //   google.accounts.id.disableAutoSelect();
  //   sessionStorage.removeItem('usertoken');
  // }
}
