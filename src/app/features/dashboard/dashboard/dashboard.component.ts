import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { AuthenticationResponse } from '@core/models/auth.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {
  currentUser: AuthenticationResponse | null = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }
}
