import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { AuthenticationResponse } from '@core/models/auth.models';

interface NavigationItem {
  label: string;
  path: string;
  exact?: boolean;
  roles: string[];
}

import {
  Bell,
  ChevronDown,
  Circle,
  LogOut,
  LucideAngularModule,
  Settings,
  User
} from 'lucide-angular';
import { navigationItems } from '@shared/config/navigation';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: 'dashboard-layout.component.html'
})
export class DashboardLayoutComponent {
  loading = false;
  currentUser: AuthenticationResponse | null = null;
  isAuthenticated = false;
  isUserMenuOpen = false;
  visibleNavigationItems: NavigationItem[] = [];
  protected readonly Circle = Circle;
  protected readonly Bell = Bell;
  protected readonly User = User;
  protected readonly Settings = Settings;
  protected readonly LogOut = LogOut;
  protected readonly ChevronDown = ChevronDown;
  protected allNavigationItems: NavigationItem[] = navigationItems;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
      this.updateNavigationItems();
    });
  }

  private updateNavigationItems() {
    if (!this.currentUser) {
      this.visibleNavigationItems = [];
      return;
    }

    const userRole = this.currentUser.role;
    this.visibleNavigationItems = this.allNavigationItems.filter((item) =>
      item.roles.includes(userRole)
    );
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  signout() {
    this.loading = true;
    this.authService.signout().subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/auth/signin']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Signout failed:', error);
      }
    });
  }
}
