import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { AuthenticationResponse } from '@core/models/auth.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: 'app.component.html'
})
export class AppComponent {
  loading = false;
  currentUser: AuthenticationResponse | null = null;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Subscribe to user changes
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
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
