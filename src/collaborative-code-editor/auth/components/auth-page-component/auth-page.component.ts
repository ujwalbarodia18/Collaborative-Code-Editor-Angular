import { Component, DestroyRef } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginForm } from '../login-form-component/login-form.component';
import { RegisterForm } from '../register-form-component/register-form.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from "../../../form-components/text-input/text-input.component";
import { UiButtonComponent } from "../../../form-components/ui-button/ui-button.component";
import { AuthService } from '../../auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-auth-page',
  imports: [ReactiveFormsModule, TextInputComponent, UiButtonComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthPage {
  form!: FormGroup;
  mode: 'login' | 'register' = 'login';
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private destroyRef: DestroyRef) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectToLandingPage();
      return;
    }

    this.setMode('login');
  }

  handleRegister(): Observable<any> | undefined{
    if (this.form.invalid) {
      return undefined;
    }
    const formValue = this.form.getRawValue();
    console.log("Form value", formValue);
    return this.authService.register(formValue);
  }

  handleLogin(): Observable<any> | undefined {
    if (this.form.invalid) {
      return undefined;
    }
    const formValue = this.form.getRawValue();

    return this.authService.login(formValue);
  }

  handleSubmit() {
    this.loading = true;
    const redirectionSub = this.mode === 'login' ? this.handleLogin() : this.handleRegister();
    if (redirectionSub) {
      redirectionSub
      .pipe(finalize(() => this.loading = false), takeUntilDestroyed(this.destroyRef))
      .subscribe(d => {
        console.log("D", d);
        this.redirectToLandingPage();
      })
    }
  }

  redirectToLandingPage() {
    this.router.navigate(['/']);
  }

  initializeLoginForm() {
    this.form = this.fb.group({
      email: this.fb.control(''),
      password: this.fb.control(''),
    });
  }

  initializeRegisterForm() {
    this.form = this.fb.group({
      email: this.fb.control(''),
      password: this.fb.control(''),
      name: this.fb.control(''),
      confirmPassword: this.fb.control('')
    })
  }

  setMode(mode: 'login' | 'register') {
    this.mode = mode;

    if (this.mode === 'login') {
      this.initializeLoginForm();
    }
    else {
      this.initializeRegisterForm();
    }
  }
}
