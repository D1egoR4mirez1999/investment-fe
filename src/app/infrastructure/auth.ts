import { Service, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ILoginRequest, ILoginResponse, IUser } from '../domain/user';
import { BrowserStorage } from './browser-storage';

const TOKEN_KEY = 'investment_access_token';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(BrowserStorage);

  private readonly tokenSignal = signal<string | null>(this.storage.getItem(TOKEN_KEY));
  private readonly userSignal = signal<IUser | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  login(credentials: ILoginRequest): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.storage.setItem(TOKEN_KEY, response.accessToken);
          this.tokenSignal.set(response.accessToken);
        }),
      );
  }

  loadMe(): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/auth/me`).pipe(
      tap((user) => this.userSignal.set(user)),
    );
  }

  logout(): void {
    this.storage.removeItem(TOKEN_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    void this.router.navigateByUrl('/login');
  }
}
