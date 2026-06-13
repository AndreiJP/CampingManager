import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    
    <main class="container py-5">
      <div class="row align-items-center mb-5">
        <div class="col-lg-6">
          <div class="polaroid-gallery">
            <div class="polaroid" *ngFor="let photo of photos; let i = index" [style.transform]="'rotate(' + (i % 2 === 0 ? '-3deg' : '3deg') + ')'">
              <img [src]="photo" alt="Camping photo">
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="card p-4 p-md-5 border-0 shadow-sm rounded-4">
            <h1 class="mb-4">{{ "NAVBAR.ABOUT" | translate }}</h1>
            <p *ngFor="let p of paragraphs">{{ p | translate }}</p>
          </div>
        </div>
      </div>
    </main>
    <app-site-footer></app-site-footer>
  `,
  styles: [`
    .rounded-4 { border-radius: 1.5rem !important; }
    .polaroid-gallery {
      display: flex;
      justify-content: center;
      gap: 1rem;
      padding: 2rem;
    }
    .polaroid {
      background: #fff;
      padding: 1rem 1rem 2.5rem 1rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      max-width: 200px;
      transition: transform 0.3s ease, z-index 0.3s;
      cursor: pointer;
    }
    .polaroid:hover {
      transform: scale(1.1) rotate(0deg) !important;
      z-index: 10;
    }
    .polaroid img {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  `]
})
export class AboutPageComponent {
  readonly paragraphs = [
    "ABOUT.P1",
    "ABOUT.P2"
  ];

  readonly photos = [
    "https://picsum.photos/300/300?camping=1",
    "https://picsum.photos/300/300?camping=2",
    "https://picsum.photos/300/300?camping=3"
  ];
}
