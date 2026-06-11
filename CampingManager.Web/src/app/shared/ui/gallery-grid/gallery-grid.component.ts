import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gallery-grid container my-5">
      <div class="row g-3">
        <div class="col-md-4" *ngFor="let item of images">
          <img [src]="item" class="img-fluid rounded" alt="Gallery image">
        </div>
      </div>
    </div>
  `,
  styles: [`
    .img-fluid { width: 100%; height: 250px; object-fit: cover; transition: 0.3s; }
    .img-fluid:hover { transform: scale(1.05); }
  `]
})
export class GalleryGridComponent {
  @Input() images: string[] = [];
}
