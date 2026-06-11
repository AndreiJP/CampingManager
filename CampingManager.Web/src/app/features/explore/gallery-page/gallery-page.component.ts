import { Component } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-gallery-page",
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block
      title="Galleria"
      [paragraphs]="paragraphs"
    ></app-content-block>
    <app-site-footer></app-site-footer>
  `,
})
export class GalleryPageComponent {
  readonly paragraphs = [
    "La galleria fotografica verra collegata quando saranno disponibili immagini reali del campeggio.",
  ];
}
