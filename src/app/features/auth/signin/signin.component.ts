import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, JsonPipe, CommonModule],
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
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

  get diagnostic() {
    return {
      valid: this.signinForm.valid,
      value: this.signinForm.value,
      touched: this.signinForm.touched,
      dirty: this.signinForm.dirty,
      errors: this.signinForm.errors
    };
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  // onSubmit() {
  //   if (this.signinForm.valid) {
  //     this.authService.signin(this.signinForm.value).subscribe({
  //       next: () => {
  //         this.router.navigateByUrl(this.returnUrl);
  //       },
  //       error: (error) => {
  //         console.error('Signin failed:', error);
  //         // Handle error (show message to user)
  //       }
  //     });
  //   }
  // }
  // signin.component.ts
  onSubmit() {
    console.log('Form submitted', this.signinForm.value);
    if (this.signinForm.valid) {
      console.log('Form is valid, calling signin');
      this.authService.signin(this.signinForm.value).subscribe({
        next: (response) => {
          console.log('Signin successful', response);
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          console.error('Signin failed:', error);
          // Handle error (show message to user)
        }
      });
    } else {
      console.log('Form is invalid', this.signinForm.errors);
    }
  }
}
