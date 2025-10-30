import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const location = inject(Location);
  const authService = inject(AuthService);
  if(authService.getUserbyToken()){
    location.back();
    return false;
  }
  else 
    return true;
};
