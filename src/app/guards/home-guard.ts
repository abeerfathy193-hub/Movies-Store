import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const homeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.getUserbyToken();
  if (user && user.role === "admin") {
    router.navigate(["/Dashboard"]);
    return false;
  }
  else
    return true;
};
