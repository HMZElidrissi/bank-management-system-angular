import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { Circle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule, AlertComponent, LucideAngularModule],
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  error: string | null = null;
  isSubmitting = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signinForm.get(fieldName);
    return field ? field.invalid && field.touched : false;
  }

  onSubmit() {
    if (this.signinForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;

      this.authService.signin(this.signinForm.value).subscribe({
        next: () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.isSubmitting = false;
          if (error.status === 401) {
            this.error = 'Invalid email or password';
          } else if (error.error?.message) {
            this.error = error.error.message;
          } else {
            this.error = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }

  protected readonly Circle = Circle;
}
