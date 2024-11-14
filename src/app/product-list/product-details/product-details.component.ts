import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent {
  details: string = '';
}
