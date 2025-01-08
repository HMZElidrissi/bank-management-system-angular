import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Circle, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LucideAngularModule, RouterLink],
  templateUrl: 'auth-layout.component.html'
})
export class AuthLayoutComponent {
  protected Circle = Circle;
}
