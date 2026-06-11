import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-content-block",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-block container my-5">
      <h2 class="mb-4">{{ title }}</h2>
      <div class="content-body">
        <p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
        <ul *ngIf="items.length > 0">
          <li *ngFor="let item of items">{{ item }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      .content-block {
        max-width: 800px;
      }
      h2 {
        color: var(--site-green);
        border-left: 4px solid var(--site-accent);
        padding-left: 1rem;
      }
      .content-body {
        line-height: 1.8;
        color: var(--site-muted);
      }
      .content-body p:last-child {
        margin-bottom: 0;
      }
    `,
  ],
})
export class ContentBlockComponent {
  @Input() title = "";
  @Input() paragraphs: string[] = [];
  @Input() items: string[] = [];
}
