import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '@core/services/account.service';
import { UserService } from '@core/services/user.service';
import { AccountStatus } from '@core/models/account.models';
import { User } from '@core/models/user.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './account-form.component.html'
})
export class AccountFormComponent implements OnInit {
  accountForm: FormGroup;
  users: User[] = [];
  loading = false;
  submitting = false;
  error: string | null = null;
  accountId: number | null = null;
  isEditMode = false;
  protected readonly AccountStatus = AccountStatus;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.accountForm = this.fb.group({
      userId: ['', [Validators.required]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      status: [AccountStatus.ACTIVE]
    });
  }

  ngOnInit(): void {
    this.loadUsers();

    // Check if we're in edit mode
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.accountId = +id;
      this.loadAccount(this.accountId);
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          this.users = response.content;
        },
        error: (error) => {
          this.error = 'Failed to load users';
          console.error('Error loading users:', error);
        }
      });
  }

  loadAccount(id: number): void {
    this.loading = true;
    this.accountService
      .getAccountsByUserId(id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (accounts) => {
          const account = accounts[0];
          if (account) {
            this.accountForm.patchValue({
              userId: account.userId,
              initialBalance: account.balance,
              status: account.status
            });
          }
        },
        error: (error) => {
          this.error = 'Failed to load account';
          console.error('Error loading account:', error);
        }
      });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) return;

    this.submitting = true;
    this.error = null;

    const request = {
      userId: this.accountForm.get('userId')?.value,
      initialBalance: this.accountForm.get('initialBalance')?.value
    };

    const operation = this.isEditMode
      ? this.accountService.updateAccountBalance(this.accountId!, {
          amount: request.initialBalance,
          status: this.accountForm.get('status')?.value
        })
      : this.accountService.createAccount(request);

    operation.pipe(finalize(() => (this.submitting = false))).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/accounts']);
      },
      error: (error) => {
        this.error = 'Failed to save account';
        console.error('Error saving account:', error);
      }
    });
  }
}
