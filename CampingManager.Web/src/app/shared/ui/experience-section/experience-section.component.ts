import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="experience-section" [class.image-right]="imagePosition === 'right'">
      <div class="image-container">
        <img [src]="imageUrl" [alt]="title" />
      </div>
      <div class="content-container">
        <h2>{{ title }}</h2>
        <p>{{ description }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent {
  @Input() imageUrl = '';
  @Input() title = '';
  @Input() description = '';
  @Input() imagePosition: 'left' | 'right' = 'left';
}
