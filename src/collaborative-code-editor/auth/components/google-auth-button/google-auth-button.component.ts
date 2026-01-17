import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../auth.service';
import { GoogleAuthLoaderService } from '../../google-auth-loader.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
export const GOOGLE_AUTH_CLIENT_ID = '514164867886-mogmd762v1u1rhl03a7nfc53fngcah3r.apps.googleusercontent.com';
@Component({
  selector: 'ui-google-auth-button',
  imports: [],
  templateUrl: './google-auth-button.component.html',
  styleUrl: './google-auth-button.component.scss',
})
export class GoogleAuthButton {
  @ViewChild('googleBtn', { static: true })
  btnRef!: ElementRef;

  constructor(private auth: AuthService, private googleAuthLoader: GoogleAuthLoaderService, private router: Router, private destroyRef: DestroyRef) {}
  client: any;
  async ngOnInit() {
    const isLoaded = await this.googleAuthLoader.load();
    if (!isLoaded) return;
    const google = (window as any).google;
    google.accounts.id.initialize({
      client_id: GOOGLE_AUTH_CLIENT_ID,
      callback: (res: any) => {
        this.auth.loginWithGoogle(res.credential)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.redirectToLandingPage())
      }
    });

    google.accounts.id.renderButton(this.btnRef.nativeElement, {
      theme: 'filled_blue',
      size: 'large',
      shape: 'rectangular',
      text: 'continue_with'
    });
  }

  redirectToLandingPage() {
    this.router.navigate(['/']);
  }

  handleGoogleLogin() {
    this.client.requestCode();
  }
}
