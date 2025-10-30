import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

export const dashboardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const location = inject(Location);
  const user = authService.getUserbyToken();
  if(user && user.role === "admin")
    return true;
  else{
    location.back();
    return false;
  }
};
