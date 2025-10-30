import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.getUserbyToken();
  const location = inject(Location);
  if (user){
    if (user.role === "admin") {
      location.back();
      return false;
    }
    else
      return true;
  }
  else {
    router.navigate(["/Login"]);
    return false;
  }
};
