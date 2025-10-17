import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';

export class AuthGuard implements CanActivate {
  constructor(private auth: AuthServiceService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}