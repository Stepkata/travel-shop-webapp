import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const managerGuard: CanActivateFn = (route, state) => {
  const auth = inject(AccountService);
  const router = inject(Router);
  if (auth.checkManager()) {
    return true; // Allow access to the route
  } else {
    router.navigate(['']).then(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    return false; // Prevent access to the route
  }
};
