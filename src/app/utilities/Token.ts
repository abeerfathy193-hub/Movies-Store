import { IUser } from "../Interface/IUser";
import * as CryptoJS from 'crypto-js';

export class Token{

    private tokenKey: string = "8d527d8c1adb6addcb06f292427c95d4";
    
    encryptToken(user: IUser): string {
    const userJson = JSON.stringify(user);
    const encrypted = CryptoJS.AES.encrypt(userJson, this.tokenKey).toString();
    return encrypted;
  }

  decryptToken(token: string): IUser | null {
    try {
      const bytes = CryptoJS.AES.decrypt(token, this.tokenKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Invalid or corrupted token:', error);
      return null;
    }
  }
}