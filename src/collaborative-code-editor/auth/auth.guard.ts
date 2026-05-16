import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../data-collaborative-code-editor/services/user.service';
import { map, of, switchMap } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = inject(UserService);

  if (!auth.isLoggedIn()) {
    auth.setRedirectUrl(state.url);
    router.navigate(['/']);
    return false;
  }

  return user?.setUser()
    .pipe(
      switchMap(() => of(user.getUser())),
      map(d => !!d)
    );
};
