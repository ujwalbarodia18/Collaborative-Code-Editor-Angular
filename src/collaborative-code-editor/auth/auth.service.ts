import { Injectable } from "@angular/core";
import { ApiService } from "../data-collaborative-code-editor/services/api.service";
import { authEndPoints } from "../../constants";
import { tap } from "rxjs";
import { Router } from "@angular/router";
import { LoginPayload } from "../common/models/auth";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  constructor(private api: ApiService, private router: Router) {}

  login(loginDetails: LoginPayload) {
    return this.api.post(authEndPoints.login, loginDetails)
    .pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  register(registerDetails: LoginPayload) {
    return this.api.post(authEndPoints.register, registerDetails)
    .pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  loginWithGoogle(googleId: string) {
    return this.api.post(authEndPoints.googleLogin, { idToken: googleId }).pipe(
      tap(res => this.handleAuthSuccess(res))
    );
  }

  handleAuthSuccess(res: any) {
    const token = res?.data?.token;
    if (!token) return;
    this.setTokenInLocalStorage(token);
  }

  setTokenInLocalStorage(token: string) {
    if (!token) return;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn() {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  logout() {
    const google = (window as any).google;
    google?.accounts?.id?.disableAutoSelect?.();
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/']);
  }
}
