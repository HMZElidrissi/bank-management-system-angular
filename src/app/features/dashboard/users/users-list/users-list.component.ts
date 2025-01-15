import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Role, User } from '@core/models/user.models';
import { UserService } from '@core/services/user.service';
import { AuthService } from '@core/services/auth.service';
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  LucideAngularModule,
  Mail,
  PlusCircle,
  Search,
  Trash2,
  UserCog
} from 'lucide-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PaginatedComponent } from '../../../../shared/components/paginated/paginated.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './users-list.component.html'
})
export class UsersListComponent extends PaginatedComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  isAdmin = false;
  searchControl = new FormControl('');

  protected readonly PlusCircle = PlusCircle;
  protected readonly Edit = Edit;
  protected readonly Trash2 = Trash2;
  protected readonly Search = Search;
  protected readonly ChevronLeft = ChevronLeft;
  protected readonly ChevronRight = ChevronRight;
  protected readonly UserCog = UserCog;
  protected readonly Mail = Mail;
  protected readonly DollarSign = DollarSign;
  protected readonly BadgeCheck = BadgeCheck;
  protected readonly Math = Math;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    super();
    this.isAdmin = this.authService.hasRole('ADMIN');
  }

  ngOnInit(): void {
    this.loadData();
    this.setupSearch();
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          this.searchUsers(query);
        } else {
          this.loadData();
        }
      });
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    const request$ = this.isAdmin
      ? this.userService.getAllCustomers(this.currentPage, this.pageSize, this.sortBy, this.sortDir)
      : this.userService.getAllUsers(this.currentPage, this.pageSize, this.sortBy, this.sortDir);

    request$.subscribe({
      next: (response) => {
        this.users = response.content;
        this.currentPage = response.pageNo;
        this.pageSize = response.pageSize;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  searchUsers(query: string): void {
    this.loading = true;
    this.userService
      .searchUsers({
        query,
        page: this.currentPage,
        size: this.pageSize,
        sortBy: this.sortBy,
        sortDir: this.sortDir
      })
      .subscribe({
        next: (response) => {
          this.users = response.content;
          this.currentPage = response.pageNo;
          this.pageSize = response.pageSize;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to search users';
          this.loading = false;
          console.error('Error searching users:', error);
        }
      });
  }

  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.loading = true;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadData();
      },
      error: (error) => {
        this.error = 'Failed to delete user';
        this.loading = false;
        console.error('Error deleting user:', error);
      }
    });
  }

  getRoleBadgeClass(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'text-purple-600 bg-purple-50';
      case Role.EMPLOYEE:
        return 'text-blue-600 bg-blue-50';
      case Role.USER:
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }
}
