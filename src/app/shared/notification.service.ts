import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private toast = inject(MatSnackBar);

  /** Shows error toast message. */
  showError(message: string, action?: string) {
    this.toast.open(message, action ?? 'Dismiss', { duration: 3000 });
  }

  /** Shows success toast message. */
  showSuccess(message: string, action?: string) {
    this.toast.open(message, action ?? 'Dismiss', { duration: 3000 });
  }
}
