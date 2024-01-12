import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AccountService);
  const router = inject(Router);
  if (auth.checkLogin()) {
    return true; // Allow access to the route
  } else {
    router.navigate(['login']);
    return false; // Prevent access to the route
  }
};
