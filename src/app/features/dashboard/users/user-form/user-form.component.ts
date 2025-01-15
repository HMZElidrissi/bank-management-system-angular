import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { Role } from '@core/models/user.models';
import { LucideAngularModule } from 'lucide-angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, RouterLink],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  loading = false;
  submitting = false;
  error: string | null = null;
  userId: number | null = null;
  isEditMode = false;
  protected readonly roles = Object.values(Role);

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      age: [null, [Validators.required, Validators.min(18)]],
      monthlyIncome: [null, [Validators.required, Validators.min(0)]],
      creditScore: [null, [Validators.required, Validators.min(300), Validators.max(850)]],
      role: [Role.USER, [Validators.required]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.userId = +id;
      this.setupEditMode();
      this.loadUser(this.userId);
    }
  }

  private setupEditMode(): void {
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('email')?.disable();
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService
      .getUserById(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (user) => {
          this.userForm.patchValue({
            name: user.name,
            email: user.email,
            age: user.age,
            monthlyIncome: user.monthlyIncome,
            creditScore: user.creditScore,
            role: user.role
          });
        },
        error: (error) => {
          this.error = 'Failed to load user';
          console.error('Error loading user:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.submitting = true;
    this.error = null;

    const request = {
      ...this.userForm.getRawValue(), // Use getRawValue to include disabled controls
      email: this.isEditMode ? this.userForm.get('email')?.value : this.userForm.value.email
    };

    const operation = this.isEditMode
      ? this.userService.updateUser(this.userId!, request)
      : this.userService.createUser(request);

    operation.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/users']);
      },
      error: (error) => {
        this.error = error?.error?.message || 'Failed to save user';
        console.error('Error saving user:', error);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';

    const errors = control.errors;

    const errorMessages: { [key: string]: { [key: string]: string } } = {
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email'
      },
      password: {
        required: 'Password is required',
        minlength: 'Password must be at least 6 characters'
      },
      name: {
        required: 'Name is required'
      },
      age: {
        required: 'Age is required',
        min: 'Age must be at least 18'
      },
      monthlyIncome: {
        required: 'Monthly income is required',
        min: 'Monthly income cannot be negative'
      },
      creditScore: {
        required: 'Credit score is required',
        min: 'Credit score must be at least 300',
        max: 'Credit score cannot exceed 850'
      }
    };

    const fieldErrors = errorMessages[controlName];
    if (!fieldErrors) return '';

    return (
      Object.keys(errors)
        .map((errorKey) => fieldErrors[errorKey])
        .find((message) => message) || ''
    );
  }
}
