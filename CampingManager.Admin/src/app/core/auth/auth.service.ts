import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, finalize, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser, AuthResponse, LoginRequest } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userKey = 'campingManager.admin.user';
  private readonly expiresKey = 'campingManager.admin.expiresAt';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/Auth/login`, request).pipe(
      tap((response) => this.storeSession(response)),
    );
  }

  logout(): void {
    this.http
      .post<void>(`${environment.apiBaseUrl}/Auth/logout`, {})
      .pipe(finalize(() => this.clearSessionAndRedirect()))
      .subscribe({ error: () => undefined });
  }

  getCurrentUser(): AdminUser | null {
    const rawUser = sessionStorage.getItem(this.userKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AdminUser;
    } catch {
      this.clearSession();
      return null;
    }
  }

  isAuthenticated(): boolean {
    const expiresAt = sessionStorage.getItem(this.expiresKey);

    if (!expiresAt) {
      return false;
    }

    return new Date(expiresAt).getTime() > Date.now();
  }

  clearSessionAndRedirect(): void {
    this.clearSession();
    void this.router.navigate(['/login']);
  }

  private storeSession(response: AuthResponse): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(response.user));
    sessionStorage.setItem(this.expiresKey, response.expiresAt);
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.expiresKey);
  }
}
