import { Component, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from "../../../form-components/text-input/text-input.component";
import { UiButtonComponent } from "../../../form-components/ui-button/ui-button.component";
import { AuthService } from '../../auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { CustomValidators } from '../../../common/helpers/validators';
import { ToastrService } from 'ngx-toastr';
import { GoogleAuthButton } from '../google-auth-button/google-auth-button.component';
import { UiDialogComponent } from "../../../ui-components/ui-dialog/ui-dialog.component";

@Component({
  selector: 'app-auth-component',
  imports: [ReactiveFormsModule, TextInputComponent, UiButtonComponent, GoogleAuthButton, UiDialogComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
})
export class AuthComponent {
  form!: FormGroup;
  mode: 'login' | 'register' = 'login';
  loading: boolean = false;
  showErrors: boolean = false;
  showAuthForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.redirectToLandingPage();
      return;
    }

    this.setMode('login');
  }

  handleSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.toast.error('Fix all errors');
      return;
    }
    const action$ =
    this.mode === 'login'
      ? this.authService.login(this.form.getRawValue())
      : this.authService.register(this.form.getRawValue());

    this.loading = true;
    action$.pipe(
      finalize(() => (this.loading = false)),
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(() => this.redirectToLandingPage());
  }

  redirectToLandingPage() {
    this.router.navigate(['/editor']);
  }

  buildLoginForm() {
    this.form = this.fb.group({
      email: this.fb.control('',[Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required),
    });
  }

  buildRegisterForm() {
    this.form = this.fb.group(
      {
        email: this.fb.control('', [Validators.required, Validators.email]),
        password: this.fb.control('', [Validators.required]),
        name: this.fb.control('', [Validators.required]),
        confirmPassword: this.fb.control('', [Validators.required])
      },
      {
        validators: CustomValidators.matchFieldsValidator('password', 'confirmPassword', 'confirm_password_mismatch')
      }
    );
  }

  setMode(mode: 'login' | 'register') {
    this.mode = mode;

    if (this.mode === 'login') {
      this.buildLoginForm();
    }
    else {
      this.buildRegisterForm();
    }
  }

  handleUseEmailButtonClick() {
    this.showAuthForm = true;
    this.setMode('login')
  }

  hideAuthForm() {
    this.showAuthForm = false;
  }
}
