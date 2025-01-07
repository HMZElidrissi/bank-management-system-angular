import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { Circle, Loader2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, AlertComponent, LucideAngularModule],
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string | null = null;
  isSubmitting = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(confirmPassword.errors);
    }
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  getPasswordError(): string {
    const password = this.signupForm.get('password');
    if (password?.errors) {
      if (password.errors['required']) return 'Password is required';
      if (password.errors['minlength']) return 'Password must be at least 8 characters';
    }
    return '';
  }

  onSubmit() {
    if (this.signupForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;

      this.authService
        .signup({
          name: this.signupForm.value.name,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password
        })
        .subscribe({
          next: () => {
            this.router.navigateByUrl(this.returnUrl);
          },
          error: (error) => {
            this.isSubmitting = false;
            if (error.status === 409) {
              this.error = 'Email already exists';
            } else if (error.error?.message) {
              this.error = error.error.message;
            } else {
              this.error = 'An unexpected error occurred. Please try again later.';
            }
          }
        });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  protected readonly Circle = Circle;
  protected readonly Loader2 = Loader2;
}
