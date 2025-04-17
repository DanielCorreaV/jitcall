import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: Auth) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          const tokenResult = await user.getIdTokenResult();
          const isValid = new Date(tokenResult.expirationTime) > new Date();
          resolve(isValid);
        } else {
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
