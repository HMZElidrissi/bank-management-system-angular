import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Toast, ToastType } from '@core/models/common.models';
import { ToastService } from '@core/services/toast.service';
import { tap } from 'rxjs';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  LucideAngularModule,
  XCircle
} from 'lucide-angular';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2">
      @for (toast of toasts; track toast) {
        <div
          class="rounded-md p-4 max-w-md shadow-lg transform transition-all"
          [ngClass]="getToastClasses(toast.type)"
          @fadeSlide
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ng-container [ngSwitch]="toast.type">
                <lucide-icon
                  *ngSwitchCase="'success'"
                  [img]="CheckCircle"
                  class="text-green-400"
                  [size]="20"
                >
                </lucide-icon>
                <lucide-icon
                  *ngSwitchCase="'error'"
                  [img]="XCircle"
                  class="text-red-400"
                  [size]="20"
                >
                </lucide-icon>
                <lucide-icon
                  *ngSwitchCase="'warning'"
                  [img]="AlertTriangle"
                  class="text-yellow-400"
                  [size]="20"
                >
                </lucide-icon>
                <lucide-icon
                  *ngSwitchCase="'info'"
                  [img]="AlertCircle"
                  class="text-blue-400"
                  [size]="20"
                >
                </lucide-icon>
              </ng-container>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium" [ngClass]="getTextClasses(toast.type)">
                {{ toast.message }}
              </p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];
  protected readonly CheckCircle = CheckCircle;
  protected readonly XCircle = XCircle;
  protected readonly AlertTriangle = AlertTriangle;
  protected readonly AlertCircle = AlertCircle;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts
      .pipe(
        tap((toast) => {
          this.toasts.push(toast);
          setTimeout(() => {
            this.removeToast(toast);
          }, toast.duration || 5000);
        })
      )
      .subscribe();
  }

  private removeToast(toast: Toast) {
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }
  }

  getToastClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 border border-green-100';
      case 'error':
        return 'bg-red-50 border border-red-100';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-100';
      case 'info':
        return 'bg-blue-50 border border-blue-100';
    }
  }

  getTextClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  }
}
