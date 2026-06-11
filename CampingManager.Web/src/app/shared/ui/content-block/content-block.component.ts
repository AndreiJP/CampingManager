import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-content-block',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-block container my-5">
      <h2 class="mb-4">{{ title }}</h2>
      <div class="content-body" [innerHTML]="content"></div>
    </div>
  `,
  styles: [`
    .content-block { max-width: 800px; }
    h2 { color: var(--site-green); border-left: 4px solid var(--site-accent); padding-left: 1rem; }
    .content-body { line-height: 1.8; color: var(--site-muted); }
  `]
})
export class ContentBlockComponent {
  @Input() title = '';
  @Input() content = '';
}
