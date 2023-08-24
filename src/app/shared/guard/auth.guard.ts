import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Observable, map, take } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated.pipe(
      take(1), // Pegue apenas um valor do Observable
      map((authenticated) => {
        if (authenticated) {
          return true;
        } else {
          this.router.navigate(['sign-in'], {
            queryParams: { returnUrl: state.url }, // Passa a URL atual como parâmetro
          });
          return false;
        }
      })
    );
  }
}
