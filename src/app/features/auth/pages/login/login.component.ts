import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
//import { AuthService } from '../../../../shared/services/auth.service';
import { LoggerService } from '../../../../core';
import { ErrorHandlerService } from '../../../../core';
import { CustomValidators } from '../../../../shared/validators/custom.validators';
import { LoginRequest } from '../../models/auth.model';


/**
 * Login Component (Reactive Forms)
 * Handles user authentication with email and password
 * Location: src/app/features/auth/components/login/
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
   // private authService: AuthService,
    private logger: LoggerService,
    private errorHandler: ErrorHandlerService
  ) {
      console.log('🔥 LOGIN COMPONENT CONSTRUCTOR CALLED');
    this.initializeForm();
  }

  ngOnInit(): void {
    this.logger.log('LoginComponent initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    
    this.destroy$.complete();
  }

  /**
   * Initialize reactive form with validators
   */
  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, CustomValidators.emailFormat()]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6)]
      ],
      rememberMe: [false]
    });
  }

  /**
   * Form controls getters for template access
   */
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }

  /**
   * Validation state checks
   */
  isEmailTouched(): boolean {
    return this.email?.touched ?? false;
  }

  isEmailInvalid(): boolean {
    return !!(this.email?.invalid && this.email?.touched);
  }

  isPasswordTouched(): boolean {
    return this.password?.touched ?? false;
  }

  isPasswordInvalid(): boolean {
    return !!(this.password?.invalid && this.password?.touched);
  }

  /**
   * Handle login submission
   */
  handleLogin(): void {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly';
      this.logger.warn('Login form invalid', { errors: this.loginForm.errors });
      return;
    }

    this.isLoading = true;
    const loginData: LoginRequest = this.loginForm.getRawValue();

    this.logger.info('Login attempt initiated', { email: loginData.email });

    // TODO: Replace with actual API call
    // this.authService.login(loginData)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => this.handleLoginSuccess(response),
    //     error: (error) => this.handleLoginError(error)
    //   });

    // Simulate API call for now
    setTimeout(() => {
      this.isLoading = false;
      this.logger.log('Login simulated successfully', { email: loginData.email });
      // Uncomment when backend is ready:
      // this.router.navigate(['/dashboard']);
    }, 1500);
  }

  /**
   * Navigate to forgot password page
   */
  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  /**
   * Handle successful login
   */
  private handleLoginSuccess(response: any): void {
    this.isLoading = false;
    this.logger.log('Login successful');
    // TODO: Store token and navigate to dashboard
    // this.authService.setToken(response.token);
    // this.router.navigate(['/dashboard']);
  }

  /**
   * Handle login error
   */
  private handleLoginError(error: any): void {
    this.isLoading = false;
    this.errorMessage = error.message || 'Login failed. Please try again.';
    this.errorHandler.handleError(this.errorMessage);
    this.logger.error('Login failed', error);
  }
}
