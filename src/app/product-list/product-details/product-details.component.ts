import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './product-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent {
  details = signal('');
}