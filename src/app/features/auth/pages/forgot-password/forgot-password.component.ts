import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomValidators } from '../../../../shared/validators/custom.validators';
import { LoggerService } from '../../../../core/services/logger.service';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

/**
 * Forgot Password Component
 * Handles password reset requests
 */
@Component({
  // selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private logger: LoggerService,
    private errorHandler: ErrorHandlerService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.logger.log('ForgotPasswordComponent initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [Validators.required, CustomValidators.emailFormat()]
      ]
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  handleForgotPassword(): void {
    if (this.forgotPasswordForm.invalid) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const emailValue = this.forgotPasswordForm.get('email')?.value;
    this.logger.info('Forgot password request initiated', { email: emailValue });

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Password reset link has been sent to your email';
      this.logger.log('Forgot password link sent successfully');

      // Auto-navigate back to login after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000);
    }, 1500);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Getter for form validation
  isEmailTouched(): boolean {
    return this.email?.touched ?? false;
  }

  isEmailInvalid(): boolean {
    return !!(this.email?.invalid && this.email?.touched);
  }
}
