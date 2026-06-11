import { Component } from "@angular/core";
import { SharedModule } from "../../../shared/shared-module";

@Component({
  selector: "app-about-page",
  standalone: true,
  imports: [SharedModule],
  template: `
    <app-site-navbar></app-site-navbar>
    <app-content-block
      title="Chi siamo"
      [paragraphs]="paragraphs"
    ></app-content-block>
    <app-site-footer></app-site-footer>
  `,
})
export class AboutPageComponent {
  readonly paragraphs = [
    "Siamo una realta immersa nel verde, dedicata a chi cerca una vacanza semplice, naturale e ben organizzata.",
    "Il campeggio nasce per accogliere famiglie, camperisti e viaggiatori che vogliono vivere il territorio con calma e comfort.",
  ];
}
