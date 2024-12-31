import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-lg border p-4 mb-4"
      [class]="alertClasses"
      role="alert"
    >
      {{ message }}
    </div>
  `
})
export class AlertComponent {
  @Input() message = '';
  @Input() variant: 'default' | 'destructive' | 'success' = 'default';

  get alertClasses(): string {
    switch (this.variant) {
      case 'destructive':
        return 'border-red-500 bg-red-50 text-red-700';
      case 'success':
        return 'border-green-500 bg-green-50 text-green-700';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  }
}
