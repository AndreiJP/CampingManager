import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="experience-card">
      <img [src]="imageUrl" [alt]="title" class="card-img" />
      <div class="card-body">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./experience-card.component.scss']
})
export class ExperienceCardComponent {
  @Input() imageUrl = '';
  @Input() title = '';
  @Input() description = '';
}
