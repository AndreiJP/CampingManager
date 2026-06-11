import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-gallery-page',
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-gallery-grid [images]="['https://picsum.photos/400/300?random=1','https://picsum.photos/400/300?random=2']"></app-gallery-grid>
    <app-site-footer></app-site-footer>
  `
})
export class GalleryPageComponent { }
